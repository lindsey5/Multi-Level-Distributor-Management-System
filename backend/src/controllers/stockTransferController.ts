import StockTransfer from "../models/StockTransfer";
import { Response, NextFunction } from "express";
import { AuthRequest } from "../types/types";
import { setEndDate, setStartDate } from "../utils/utils";
import Variant from "../models/Variant";
import DistributorStock from "../models/DistributorStock";
import StockTransferItem from "../models/StockTransferItem";
import mongoose from "mongoose";

export const getStockTransferLogs = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const search = (req.query.search as string) || "";
        const startDate = req.query.startDate ? setStartDate(req.query.startDate as string) : null;
        const endDate = req.query.endDate ? setEndDate(req.query.endDate as string) : null;
        const status = req.query.status || "";

        const pipeline: any[] = [
            { $match: { receiver_id: req.user._id } },

            // receiver
            {
                $lookup: {
                    from: "distributors",
                    localField: "receiver_id",
                    foreignField: "_id",
                    as: "receiver",
                },
            },
            { $unwind: "$receiver" },

            // sender
            {
                $lookup: {
                    from: "users",
                    localField: "sender_id",
                    foreignField: "_id",
                    as: "sender",
                },
            },
            { $unwind: "$sender" },

            // items
            {
                $lookup: {
                    from: "stocktransferitems",
                    localField: "_id",
                    foreignField: "transfer_id",
                    as: "items",
                },
            },
            { $unwind: "$items" },

            // variant
            {
                $lookup: {
                    from: "variants",
                    localField: "items.variant_id",
                    foreignField: "_id",
                    as: "variant",
                },
            },
            { $unwind: "$variant" },

            // product
            {
                $lookup: {
                    from: "products",
                    localField: "variant.product_id",
                    foreignField: "_id",
                    as: "product",
                },
            },
            { $unwind: "$product" },

            // attach product into items
            {
                $addFields: {
                    "items.variant": {
                        $mergeObjects: ["$variant", { product: "$product" }],
                    },
                },
            },

            {
                $project: {
                    variant: 0,
                    product: 0,
                },
            },
        ];

        const match: any = {};

        if (search) {
            match.$or = [
                { transfer_no: { $regex: search, $options: "i" } },
                { "sender.firstname": { $regex: search, $options: "i" } },
                { "sender.lastname": { $regex: search, $options: "i" } },
                { "sender.email": { $regex: search, $options: "i" } },
                { "items.variant.variant_name": { $regex: search, $options: "i" } },
                { "items.variant.sku": { $regex: search, $options: "i" } },
                { "items.variant.product.product_name": { $regex: search, $options: "i" } },
            ];
        }

        if(status){
            match.status = status;
        }

        if (startDate || endDate) {
            match.createdAt = {};
            if (startDate) match.createdAt.$gte = startDate;
            if (endDate) match.createdAt.$lte = endDate;
        }

        if (Object.keys(match).length > 0) {
            pipeline.push({ $match: match });
        }

        // group
        pipeline.push({
            $group: {
                _id: "$_id",
                receiver: { $first: "$receiver" },
                sender: { $first: "$sender" },
                createdAt: { $first: "$createdAt" },
                updatedAt: { $first: "$updatedAt" },
                items: { $push: "$items" },
                status: { $first: '$status' }
            },
        });

        // count
        const countPipeline = [...pipeline, { $count: "total" }];
        const countResult = await StockTransfer.aggregate(countPipeline);
        const total = countResult[0]?.total || 0;

        // pagination
        pipeline.push({ $sort: { createdAt: -1 } });
        pipeline.push({ $skip: skip });
        pipeline.push({ $limit: limit });

        const stockTransferLogs = await StockTransfer.aggregate(pipeline);

        res.status(200).json({
            stockTransferLogs,
            pagination: {
                page,
                limit,
                totalPages: Math.ceil(total / limit),
                total,
            },
        });
    } catch (err) {
        next(err);
    }
};

export const updateStockTransferStatus = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const session = await mongoose.startSession();

    try {
        session.startTransaction();
        if (!req.body.status) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({ message: "Status is required" });
        }

        const stockTransfer = await StockTransfer.findById(req.params.id).session(session);

        if (!stockTransfer) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({ message: "Stock transfer not found" });
        }

        if (stockTransfer.receiver_id.toString() !== req.user._id.toString()) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({ message: "Unauthorized access to this stock transfer" });
        }

        const newStatus = req.body.status;
        const currentStatus = stockTransfer.status;

        if (currentStatus === newStatus) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({ message: `Stock transfer is already ${newStatus}` });
        }

        const allowedTransitions: Record<string, string[]> = {
            pending: ["rejected", "approved"],
            approved: [],
            processing: [],
            delivered: ["received"],
            received: [],
            cancelled: [],
            rejected: []
        };

        const allowedNextStatuses = allowedTransitions[currentStatus] || [];

        if (!allowedNextStatuses.includes(newStatus)) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({ message: `Cannot change stock transfer from ${currentStatus} to ${newStatus}`});
        }

        // rollback stock if rejected
        if (newStatus === "rejected") {
            for (const item of stockTransfer.items) {
                const variant = await Variant.findById(item.variant_id).session(session);
                if (!variant) continue;

                variant.stock += item.quantity;
                await variant.save({ session });
            }
        }

        stockTransfer.status = newStatus;
        await stockTransfer.save({ session });

        const items = await StockTransferItem.find({
            transfer_id: stockTransfer._id
        }).session(session);

        if(newStatus === 'received') {
            for (const item of items) {
                const variant = await Variant.findById(item.variant_id).session(session);
                if (!variant) continue;

                const existingStock = await DistributorStock.findOne({
                    distributor_id: stockTransfer.receiver_id,
                    variant_id: item.variant_id,
                }).session(session);

                if (!existingStock) {
                    continue;
                }

                existingStock.quantity += item.quantity;
                await existingStock.save({ session });

                await DistributorStock.create(
                    [
                        {
                            distributor_id: stockTransfer.receiver_id,
                            variant_id: item.variant_id,
                            quantity: item.quantity,
                        }
                    ],
                    { session }
                );
            }
        }

        return res.status(200).json({
            message: `Stock transfer successfully updated to ${newStatus}`,
            stockTransfer,
        });

    } catch (err) {
        await session.abortTransaction();
        session.endSession();
        next(err);
    } 
};