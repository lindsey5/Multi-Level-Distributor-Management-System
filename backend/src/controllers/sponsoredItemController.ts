import { NextFunction, Response } from "express";
import { AuthRequest } from "../types/types";
import SponsoredItem from "../models/SponsoredItem";
import { setEndDate, setStartDate } from "../utils/utils";
import DistributorStock from "../models/DistributorStock";
import mongoose from "mongoose";

export const createSponsoredItem = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try{
        const stock = await DistributorStock.findOne({
            variant_id: req.body.variant_id,
            distributor_id: req.user._id
        });

        if(!stock){
            return res.status(404).json({
                message: `Variant not exist in your inventory`
            })
        }

        if (stock.quantity < req.body.quantity) {
            return res.status(400).json({
                message: `Insufficient stock. You only have ${stock.quantity} available in your inventory.`
            });
        }

        const sponsoredItem = await SponsoredItem.create({
            ...req.body,
            distributor_id: req.user._id
        });

        res.status(201).json({
            message: 'Sponsored product request successfully submitted',
            sponsoredItem
        })

    }catch(err){
        next(err);
    }
}

export const getSponsoredItems = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try{
        const page = req.query.page ? Number(req.query.page) : 1;
        const limit = req.query.limit ? Number(req.query.limit) : 10;
        const skip = (page - 1) * limit;
        const sortBy = (req.query.sortBy as string) || "createdAt";
        const order = req.query.order && String(req.query.order).toUpperCase() === "ASC" ? 1 : -1;
        const search = req.query.search?.toString() || "";
        const startDate = req.query.startDate ? setStartDate(req.query.startDate as string) : null;
        const endDate = req.query.endDate ? setEndDate(req.query.endDate as string) : null;
        const status = req.query.status ? String(req.query.status) : null;

        const filter: any = { distributor_id: req.user._id };
        if (startDate || endDate) {
            filter.createdAt = {};
            if (startDate) filter.createdAt.$gte = startDate;
            if (endDate) filter.createdAt.$lte = endDate;
        }

        if(search){
            filter.$or = [
                { sponsored_id: { $regex: search, $options: "i" } },
                { "variant.product.product_name" : { $regex: search, $options: "i" } },
                { "variant.variant_name" : { $regex: search, $options: "i" } },
                { "variant.sku" : { $regex: search, $options: "i" } },
            ]
        }

        if(status){
            filter.status = status;
        }

        const [sponsoredItems, total] = await Promise.all([
            SponsoredItem.aggregate([
                {
                    $lookup: {
                        from: "variants",
                        localField: "variant_id",
                        foreignField: "_id",
                        as: "variant"
                    }
                },
                { $unwind: "$variant" },

                {
                    $lookup: {
                        from: "products",
                        localField: "variant.product_id",
                        foreignField: "_id",
                        as: "product"
                    }
                },
                { $unwind: "$product" },
                {
                    $addFields: {
                        "variant.product": "$product"
                    }
                },
                {
                    $project: {
                        product: 0
                    }
                },
                { $match: filter },
                { $sort: { [sortBy]: order } },
                { $skip: skip },
                { $limit: limit }
            ]),
            SponsoredItem.countDocuments(filter),
        ])

        res.status(200).json({
            sponsoredItems,
            pagination: {
                page,
                limit,
                totalPages: Math.ceil(total / limit),
                total
            }
        })
    }catch(err){
        next(err);
    }
}

export const updateSponsoredItemStatus = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        const newStatus = req.body.status;

        const sponsoredItem = await SponsoredItem.findById(req.params.id)
        .populate([
            {
                path: "variant",
                populate: "product",
            },
            { path: "distributor", select: "-password" },
        ])
        .session(session);

        if (!sponsoredItem) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({
                message: "Sponsored Item not found",
            });
        }

        if(sponsoredItem.distributor_id.toString() !== req.user._id.toString()){
            return res.status(401).json({
                message: "Unauthorized"
            })
        }

        const stock = await DistributorStock.findOne({
            distributor_id: sponsoredItem.distributor_id,
            variant_id: sponsoredItem.variant_id
        })

        if(!stock) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({
                message: `Item not exist in your inventory`
            })
        }

        if(stock.quantity < sponsoredItem.quantity){
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({
                message: `Insufficient stock`
            })
        }

        stock.quantity -= sponsoredItem.quantity;
        await stock.save({ session });

        const currentStatus = sponsoredItem.status;

        const allowedTransitions: Record<string, string[]> = {
            pending: ["cancelled"],
            approved: ["cancelled", "completed"],
            completed: [],
            cancelled: [],
            rejected: [],
            expired: [],
        };

        const allowedNextStatuses = allowedTransitions[currentStatus] || [];

        if (!allowedNextStatuses.includes(newStatus)) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({
                message: `Cannot change status from ${currentStatus} to ${newStatus}. Please reload the page`,
            });
        }

        sponsoredItem.status = newStatus;
        await sponsoredItem.save({ session });

        await session.commitTransaction();
        session.endSession();

        return res.status(200).json({
            message: `Sponsored Item successfully marked as ${newStatus}`,
            sponsoredItem
        });

    } catch (err) {
        await session.abortTransaction();
        session.endSession();
        next(err);
    }
};

export const getSponsoredItemById = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try{
        const sponsoredItem = await SponsoredItem.findById(req.params.id)
        .populate([
            { path: 'distributor', select: '-password' },
            { path: 'variant', populate: 'product' }
        ]);

        if(!sponsoredItem){
            return res.status(404).json({ message: "Sponsored Item not found." });
        }

        if(sponsoredItem.distributor_id.toString() !== req.user._id.toString()){
            return res.status(401).json({ message: "Unauthorized" });
        }

        res.status(200).json({
            sponsoredItem
        })

    }catch(err){
        next(err);
    }
}