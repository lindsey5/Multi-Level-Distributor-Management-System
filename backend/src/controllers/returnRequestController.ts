import { NextFunction, Response } from "express";
import { AuthRequest } from "../types/types";
import Variant from "../models/Variant";
import ReturnRequest from "../models/ReturnRequest";
import { setEndDate, setStartDate } from "../utils/utils";

export const getReturnRequests = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try{
        const page = req.query.page ? Number(req.query.page) : 1;
        const limit = req.query.limit ? Number(req.query.limit) : 10;
        const skip = (page - 1) * limit;
        const startDate = req.query.startDate ? setStartDate(req.query.startDate as string) : null;
        const endDate = req.query.endDate ? setEndDate(req.query.endDate as string) : null;

        const match : any = { distributor_id: req.user._id };

        if (startDate || endDate) {
            match.createdAt = {};
            if (startDate) match.createdAt.$gte = startDate;
            if (endDate) match.createdAt.$lte = endDate;
        }

        const [returnRequests, total] = await Promise.all([
            ReturnRequest.find(match)
                .populate([
                    "items.variant", 
                    {
                        path: 'distributor',
                        select: '-password'
                    }
                ])
                .skip(skip)
                .limit(limit)
                .sort({ createdAt: -1 }),
            ReturnRequest.countDocuments(match)
        ])

        res.status(200).json({
            returnRequests,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        })

    }catch(err){
        next(err);
    }
}

export const createReturnRequest = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try{
        const items = req.body.items;

        for(const item of items) {
            const isVariantExist = await Variant.findById(item.variant_id);

            if(!isVariantExist) {
                return res.status(404).json({ success: false, message: `Variant ${item.variant_id} not found`})
            }
        }

        const returnRequest = await ReturnRequest.create({
            ...req.body,
            distributor_id: req.user._id
        });

        await returnRequest.populate({
            path: "items.variant",
            populate: "product"
        })

        res.status(201).json({
            succcess: true,
            returnRequest,
            message: "Return request submitted successfully"
        })

    }catch(err){
        next(err);
    }
}