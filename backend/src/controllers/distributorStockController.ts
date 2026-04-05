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
                    distributor_id: new mongoose.Types.ObjectId(req.user._id),
                },
            },
            {
                $lookup: {
                    from: "variants",
                    localField: "variant_id",
                    foreignField: "_id",
                    as: "variant",
                },
            },
            { $unwind: "$variant" },
        ];

        if (search) {
            basePipeline.push({
                $match: {
                "variant.status" : 'active',
                    $or: [
                        { "variant.variant_name": { $regex: search, $options: "i" } },
                        { "variant.sku": { $regex: search, $options: "i" } },
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