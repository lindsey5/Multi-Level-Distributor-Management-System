import { NextFunction, Response } from "express";
import { AuthRequest } from "../types/types";
import CommissionLog from "../models/CommissionLog";

export const getCommissionLogs = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try{
        const page = req.query.page ? Number(req.query.page) : 1;
        const limit = req.query.limit ? Number(req.query.limit) : 10;
        const skip = (page - 1) * limit;

        const [commissionLogs, total] = await Promise.all([
            CommissionLog.find({ receiver_id: req.user._id })
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