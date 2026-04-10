import { NextFunction, Response } from "express";
import { AuthRequest } from "../types/types";
import CommissionLog from "../models/CommissionLog";
import Distributor from "../models/Distributor";
import '../models/Product';

export const getCommissionLogs = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try{
        const page = req.query.page ? Number(req.query.page) : 1;
        const limit = req.query.limit ? Number(req.query.limit) : 10;
        const skip = (page - 1) * limit;

        const [commissionLogs, total] = await Promise.all([
            CommissionLog.find({ receiver_id: req.user._id })
            .populate({
                path: "sales",
                populate: [
                    { 
                        path: "variant",
                        populate: "product"

                    },
                    { path: "seller" }
                ]
            })
            .limit(limit)
            .skip(skip)
            .sort({ createdAt: -1 }),
            CommissionLog.countDocuments({ receiver_id: req.user._id })
        ])

        const totalPages = Math.ceil(total / limit);

        res.status(200).json({
            commissionLogs,
            pagination: {
                page,
                limit,
                totalPages,
                total
            }
        })

    }catch(err){
        next(err);
    }
}

export const getCommissionsPerMonth = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try{
        const year = Number(req.query.year) || new Date().getFullYear();
        const distributor = await Distributor.findById(req.user._id);

        const match: any = {
            createdAt: {
                $gte: new Date(year, 0, 1, 0, 0, 0, 0),
                $lte: new Date(year, 11, 31, 23, 59, 59, 999),
            },
            receiver_id: distributor?._id
        };

        const monthNames = [
            "Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
        ];

        const result = await CommissionLog.aggregate([
            { $match: match },
            {
            $group: {
                _id: { month: { $month: "$createdAt" } },
                totalCommission: { $sum: "$commission_amount" },
            },
            },
            {
            $project: {
                _id: 0,
                month: "$_id.month",
                totalCommission: 1,
            },
            },
            { $sort: { month: 1 } },
        ]);

        // Default Jan-Dec with 0
        const commissionsPerMonth = monthNames.map((name) => ({
            month: name,
            totalCommission: 0,
        }));

        // Fill actual values
        result.forEach((item) => {
            commissionsPerMonth[item.month - 1].totalCommission = item.totalCommission;
        });

        res.status(200).json({
            commissionsPerMonth,
            year
        })

    }catch(err){
        next(err);
    }
}