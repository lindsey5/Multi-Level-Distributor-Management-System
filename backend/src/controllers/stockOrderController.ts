import { NextFunction, Response } from "express";
import { AuthRequest } from "../types/types";
import Variant from "../models/Variant";
import StockOrder from "../models/StockOrder";
import mongoose from "mongoose";
import { setEndDate, setStartDate } from "../utils/utils";

export const createStockOrder = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try{
        const { items }= req.body; 
        
        for(const item of items) {
            const isVariantExist = await Variant.findOne({
                _id: new mongoose.Types.ObjectId(item.variant_id),
                status: 'active'
            });

            if(!isVariantExist) {
                return res.status(404).json({ message: `Variant ${item.variant_id} not found. Please reload the page`})
            }
        }

        const stockOrder = await StockOrder.create({
            items,
            distributor_id: req.user._id
        })

        res.status(200).json({ message: 'Stock order successfully placed', stockOrder })
    }catch(err){
        next(err);
    }
}

export const getStockOrders = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try{
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const search = (req.query.search as string) || "";
        const startDate = req.query.startDate ? setStartDate(req.query.startDate as string) : null;
        const endDate = req.query.endDate ? setEndDate(req.query.endDate as string) : null;
        const status = req.query.status || "";

        // Base match filter
        const matchStage: any = { distributor_id: req.user._id };
        if (startDate || endDate) {
            matchStage.createdAt = {};
            if (startDate) matchStage.createdAt.$gte = startDate;
            if (endDate) matchStage.createdAt.$lte = endDate;
        }

        if(status){
            matchStage.status = status;
        }

        const pipeline : any = [
            {
                $lookup: {
                    from: "distributors",
                    localField: "distributor_id",
                    foreignField: "_id",
                    as: "distributor"
                }
            },
            { $unwind: { path: '$distributor' }}
        ]

        if(search){
            pipeline.push({
                $match: {
                    $or: [
                        { stock_order_id: { $regex: search, $options: "i" } }, 
                    ]
                }
            })
        }

        const countPipeline = [...pipeline, { $count: 'total' }];
        
        pipeline.push(
            { $sort: { createdAt: -1 } },
            { $skip: skip },
            { $limit: limit },
            {
                $project: { "distributor.password": 0 }
            }
        );

        const [stockOrders, countResult] = await Promise.all([
            StockOrder.aggregate(pipeline),
            StockOrder.aggregate(countPipeline)
        ])

        const total = countResult[0]?.total || 0;

        res.status(200).json({
            stockOrders,
            pagination: {
                page,
                limit,
                totalPages: Math.ceil(total / limit),
                total
            }
        });

    }catch(err){
        next(err);
    }
}

export const getStockOrderById = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try{
        const stockOrder = await StockOrder.findById(req.params.id);

        if(!stockOrder) return res.status(404).json({ message: "Stock Order not found"});

        if(stockOrder.distributor_id.toString() !== req.user._id.toString()) return res.status(401).json({ message: 'Unauthorized' })

        res.status(200).json({ success: true, stockOrder })

    }catch(err){
        next(err);
    }
}