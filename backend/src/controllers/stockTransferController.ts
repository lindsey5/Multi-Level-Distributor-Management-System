import StockTransfer from "../models/StockTransfer";
import { Response, NextFunction } from "express";
import { AuthRequest } from "../types/types";
import { setEndDate, setStartDate } from "../utils/utils";

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
        const startDate = req.query.startDate
            ? setStartDate(req.query.startDate as string)
            : null;
        const endDate = req.query.endDate
            ? setEndDate(req.query.endDate as string)
            : null;

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
                { "sender.firstname": { $regex: search, $options: "i" } },
                { "sender.lastname": { $regex: search, $options: "i" } },
                { "sender.email": { $regex: search, $options: "i" } },
                { "items.variant.variant_name": { $regex: search, $options: "i" } },
                { "items.variant.sku": { $regex: search, $options: "i" } },
                { "items.variant.product.product_name": { $regex: search, $options: "i" } },
            ];
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