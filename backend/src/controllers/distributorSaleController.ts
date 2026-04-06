import { NextFunction, Response } from "express";
import { AuthRequest } from "../types/types";
import Variant from "../models/Variant";
import DistributorSale from "../models/DistributorSale";
import mongoose from "mongoose";
import Distributor from "../models/Distributor";
import CommissionLog from "../models/CommissionLog";
import DistributorStock from "../models/DistributorStock";

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

                await CommissionLog.create([{ receiver_id: parent_distributor._id, commission_rate: parentRate * 100, commission_amount: parentCommission }],{ session });
            }
        }
        const newBalance = distributor.wallet_balance + distributorCommission;
        distributor.set({ wallet_balance: newBalance })
        await distributor.save({ session });

        await CommissionLog.create(
        [
            {
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