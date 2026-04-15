import { NextFunction, Response } from "express";
import { AuthRequest } from "../types/types";
import Variant from "../models/Variant";
import DistributorSale from "../models/DistributorSale";
import mongoose from "mongoose";
import Distributor from "../models/Distributor";
import CommissionLog from "../models/CommissionLog";
import DistributorStock from "../models/DistributorStock";
import { setEndDate, setStartDate } from "../utils/utils";
import DistributorSaleService from "../services/DistributorSaleService";

export const createBulkDistributorSale = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        const sales = req.body;

        for (const sale of sales) {
            const variant = await Variant.findOne({ _id: sale.variant_id }).session(
                session
            );

            if (!variant) {
                await session.abortTransaction();
                session.endSession();
                return res.status(404).json({ message: `Variant not found: ${sale.variant_id}` });
            }

            const distributorStock = await DistributorStock.findOne({
                distributor_id: req.user._id,
                variant_id: variant._id
            }).session(session);

            if (!distributorStock) {
                await session.abortTransaction();
                session.endSession();
                return res.status(400).json({ message: `No stock found for variant: ${variant.variant_name}` });
            }

            if (distributorStock.quantity < sale.quantity) {
                await session.abortTransaction();
                session.endSession();
                return res.status(400).json({ message: `Insufficient stock for variant: ${variant.variant_name}. Available: ${distributorStock.quantity}, requested: ${sale.quantity}`});
            }

            distributorStock.quantity -= sale.quantity;
            distributorStock.save({ session })
        }

        const distributor = await Distributor.findById(req.user._id).session(session);

        if (!distributor) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({ message: "Distributor not found" });
        }

        const distributorSales = await DistributorSale.insertMany(
            sales.map((sale: any) => ({ ...sale, seller_id: req.user._id })),
            { session }
        );

        const total_amount = distributorSales.reduce((acc, sale) => acc + sale.total_amount, 0);

        // distributor commission
        const distributorRate = (distributor.commission_rate || 0) / 100;
        const distributorCommission = total_amount * distributorRate;

        // parent commission
        if (distributor.parent_distributor_id) {
            const parent_distributor = await Distributor.findById(distributor.parent_distributor_id).session(session);

            if (parent_distributor) {
                const parentRate = 0.02; // 2%
                const parentCommission = total_amount * parentRate;
                const newBalance = parent_distributor.wallet_balance + parentCommission;
                parent_distributor.set({ wallet_balance: newBalance})
                await parent_distributor.save({ session });

                await CommissionLog.create([{ 
                    receiver_id: parent_distributor._id, 
                    sale_ids: distributorSales.map(sale => sale._id),
                    commission_rate: parentRate * 100, 
                    commission_amount: parentCommission 
                }],{ session });
            }
        }
        const newBalance = distributor.wallet_balance + distributorCommission;
        distributor.set({ wallet_balance: newBalance })
        await distributor.save({ session });

        await CommissionLog.create(
        [
            {
                sale_ids: distributorSales.map(sale => sale._id),
                receiver_id: req.user._id,
                commission_rate: distributor.commission_rate,
                commission_amount: distributorCommission,
            },
        ],
        { session }
        );

        await session.commitTransaction();
        session.endSession();

        res.status(201).json({
            message: "Items successfully sold",
            total_amount,
            distributorCommission,
            sales: distributorSales,
        });
    } catch (err) {
        await session.abortTransaction();
        session.endSession();
        next(err);
    }
};

export const getDistributorSales = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
    try {
        const page = req.query.page ? Number(req.query.page) : 1;
        const limit = req.query.limit ? Number(req.query.limit) : 10;
        const skip = (page - 1) * limit;

        const sortBy = (req.query.sortBy as string) || "createdAt";
        const order =
        req.query.order && String(req.query.order).toUpperCase() === "ASC" ? 1 : -1;

        const search = req.query.search?.toString() || "";

        const startDate = req.query.startDate ? setStartDate(req.query.startDate as string) : null;

        const endDate = req.query.endDate ? setEndDate(req.query.endDate as string) : null;

        const distributor = await Distributor.findById(req.user._id);

        if (!distributor) {
            return res.status(404).json({
                success: false,
                message: "Distributor not found.",
            });
        }

        const matchFilter: any = { seller_id: req.user._id };

        if (startDate || endDate) {
            matchFilter.createdAt = {};
            if (startDate) matchFilter.createdAt.$gte = startDate;
            if (endDate) matchFilter.createdAt.$lte = endDate;
        }

        const pipeline: any[] = [
            { $match: matchFilter },

            {
                $lookup: {
                from: "variants",
                localField: "variant_id",
                foreignField: "_id",
                as: "variant",
                },
            },
            { $unwind: "$variant" },

            {
                $lookup: {
                from: "products",
                localField: "variant.product_id",
                foreignField: "_id",
                as: "product",
                },
            },
            { $unwind: "$product" },

            {
                $lookup: {
                from: "distributors",
                localField: "seller_id",
                foreignField: "_id",
                as: "seller",
                },
            },
            { $unwind: "$seller" },
        ];

        if (search) {
            pipeline.push({
                $match: {
                $or: [
                    { "variant.variant_name": { $regex: search, $options: "i" } },
                    { "variant.sku": { $regex: search, $options: "i" } },
                    { "product.product_name": { $regex: search, $options: "i" } },
                ],
                },
            });
        }

        const [distributorSales, totalResult] = await Promise.all([
            DistributorSale.aggregate([
            ...pipeline,
            { $sort: { [sortBy]: order } },
            { $skip: skip },
            { $limit: limit },
            ]),

            DistributorSale.aggregate([...pipeline, { $count: "total" }]),
        ]);

        const total = totalResult[0]?.total || 0;

        return res.status(200).json({
            distributorSales,
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

export const getDistributorSalesToday = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try{
        const distributor = await Distributor.findById(req.user._id);

        const sales = await DistributorSaleService.getDistributorSales({
            distributorId: distributor && distributor.status == 'active' ? distributor?.id : undefined,
            period: "today"
        })

        res.status(200).json({ sales })

    }catch(err){
        next(err);
    }
}

export const getDistributorSalesThisMonth = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try{
        const distributor = await Distributor.findById(req.user._id);

        const sales = await DistributorSaleService.getDistributorSales({
            distributorId: distributor && distributor.status == 'active' ? distributor?.id : undefined,
            period: "thisMonth"
        })

        res.status(200).json({ sales })

    }catch(err){
        next(err);
    }
}

export const getDistributorSalesThisWeek = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try{
        const distributor = await Distributor.findById(req.user._id);

        const sales = await DistributorSaleService.getDistributorSales({
            distributorId: distributor && distributor.status == 'active' ? distributor?.id : undefined,
            period: "thisWeek"
        })

        res.status(200).json({ sales })

    }catch(err){
        next(err);
    }
}

export const getDistributorSalesThisYear = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try{
        const distributor = await Distributor.findById(req.user._id);

        const sales = await DistributorSaleService.getDistributorSales({
            distributorId: distributor && distributor.status == 'active' ? distributor?.id : undefined,
            period: "thisYear"
        })

        res.status(200).json({ sales })

    }catch(err){
        next(err);
    }
}

export const getDistributorItemsSoldToday = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try{
        const distributor = await Distributor.findById(req.user._id);

        const totalQuantity = await DistributorSaleService.getDistributorItemsSold({
            distributorId: distributor && distributor.status == 'active' ? distributor?.id : undefined,
            period: 'today'
        })
        
        res.status(200).json({ totalQuantity })

    }catch(err){
        next(err);
    }
}

export const getDistributorItemsSoldThisWeek = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try{
        const distributor = await Distributor.findById(req.user._id);

        const totalQuantity = await DistributorSaleService.getDistributorItemsSold({
            distributorId: distributor && distributor.status == 'active' ? distributor?.id : undefined,
            period: 'thisWeek'
        })
        
        res.status(200).json({ totalQuantity })

    }catch(err){
        next(err);
    }
}

export const getDistributorItemsSoldThisMonth = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try{
        const distributor = await Distributor.findById(req.user._id);

        const totalQuantity = await DistributorSaleService.getDistributorItemsSold({
            distributorId: distributor?.id,
            period: 'thisMonth'
        })
        
        res.status(200).json({ totalQuantity })

    }catch(err){
        next(err);
    }
}

export const getDistributorItemsSoldThisYear = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try{
        const distributor = await Distributor.findById(req.user._id);

        const totalQuantity = await DistributorSaleService.getDistributorItemsSold({
            distributorId: distributor?.id,
            period: 'thisYear'
        })
        
        res.status(200).json({ totalQuantity })

    }catch(err){
        next(err);
    }
}

export const getDistributorMonthlySales = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try{
        const year = Number(req.query.year) || new Date().getFullYear();
        const distributor = await Distributor.findById(req.user._id);

        const monthlySales = await DistributorSaleService.getMonthlySalesByYear(
            year, 
            distributor && distributor.status == 'active' ? distributor?.id : undefined,
        );

        res.status(200).json({
            monthlySales,
            year
        })

    }catch(err){
        next(err);
    }
}

export const getDistributorItemsSoldPerMonth = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try{
        const year = Number(req.query.year) || new Date().getFullYear();
        const distributor = await Distributor.findById(req.user._id);

        const itemsSoldPerMonth = await DistributorSaleService.getItemsSoldPerMonthByYear(
            year, 
            distributor && distributor.status == 'active' ? distributor?.id : undefined,
        );

        res.status(200).json({
            itemsSoldPerMonth,
            year
        })

    }catch(err){
        next(err);
    }
}