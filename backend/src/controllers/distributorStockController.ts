import { Response, NextFunction } from "express";
import mongoose from "mongoose";
import DistributorStock from "../models/DistributorStock";
import { AuthRequest } from "../types/types";

export const getDistributorStocks = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const search = (req.query.search as string) || "";
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const skip = (page - 1) * limit;

        const distributorId = req.user._id;

        const sortBy = (req.query.sortBy as string)

        const order = (req.query.order as string) === "asc" ? 1 : -1;

        const sortStage: any = {};

        if (["variant_name", "sku", "price", "stock"].includes(sortBy)) {
            sortStage[`variant.${sortBy}`] = order;
        } else {
            sortStage[sortBy] = order;
        }

        const basePipeline: any[] = [
        {
            $match: {
            distributor_id: new mongoose.Types.ObjectId(distributorId as string),
            },
        },

        // lookup variant
        {
            $lookup: {
                from: "variants",
                localField: "variant_id",
                foreignField: "_id",
                as: "variant",
            },
        },
        { $unwind: "$variant" },

        // lookup product
        {
            $lookup: {
                from: "products",
                localField: "variant.product_id",
                foreignField: "_id",
                as: "product",
            },
        },
        { $unwind: { path: "$product", preserveNullAndEmptyArrays: true } },

        // move product inside variant
        {
            $addFields: {
                "variant.product": "$product",
            },
        },

        // remove root product
        {
            $project: {
                product: 0,
            },
        },
        ];

        if (search) {
            basePipeline.push({
                $match: {
                $or: [
                    { "variant.variant_name": { $regex: search, $options: "i" } },
                    { "variant.sku": { $regex: search, $options: "i" } },
                    { "variant.product.product_name": { $regex: search, $options: "i" } },
                ],
                },
            });
        }

        const countPipeline = [...basePipeline, { $count: "total" }];

        const dataPipeline = [
            ...basePipeline,
            { $sort: sortStage },
            { $skip: skip },
            { $limit: limit },
        ];

        const [stocks, countResult] = await Promise.all([
            DistributorStock.aggregate(dataPipeline),
            DistributorStock.aggregate(countPipeline),
        ]);

        const total = countResult.length > 0 ? countResult[0].total : 0;
        const totalPages = Math.ceil(total / limit);

        res.status(200).json({
            distributorStocks: stocks,
            pagination: {
                page,
                limit,
                totalPages,
                total,
            }
        });
    } catch (err) {
        next(err);
    }
};