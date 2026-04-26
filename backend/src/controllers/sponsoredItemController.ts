import { NextFunction, Response } from "express";
import { AuthRequest } from "../types/types";
import SponsoredItem from "../models/SponsoredItem";
import { setEndDate, setStartDate } from "../utils/utils";

export const createSponsoredItem = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try{
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