import { NextFunction, Response } from "express";
import { AuthRequest } from "../types/types";
import WithdrawalRequest from "../models/WithdrawalRequest";
import Distributor from "../models/Distributor";
import { setEndDate, setStartDate } from "../utils/utils";

export const createWithdrawalRequest = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try{
        const distributor = await Distributor.findById(req.user._id);

        if(!distributor){
            return res.status(404).json({ message: "Distributor not found" });
        }

        if (distributor.wallet_balance < req.body.amount) {
            return res.status(400).json({
                message: "Insufficient wallet balance. Please enter a lower amount."
            });
        }

        const withdrawalRequest = await WithdrawalRequest.create({
            ...req.body,
            distributor_id: req.user._id
        });

        res.status(201).json({
            message: "Withdrawal Request successfully submitted",
            withdrawalRequest
        })

    } catch(err) {
        next(err);
    }
}

export const getWithdrawalRequests = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try{
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const startDate = req.query.startDate ? setStartDate(req.query.startDate as string) : null;
        const endDate = req.query.endDate ? setEndDate(req.query.endDate as string) : null;
        const status = req.query.status || "";

        const filter : any = { distributor_id: req.user._id };

        if(startDate || endDate) {
            if(startDate) filter.createdAt.$gte = startDate;
            if(endDate) filter.createdAt.$lte = endDate;
        }

        if(status) filter.status = status;

        const [withdrawalRequests, total] = await Promise.all([
            WithdrawalRequest.find(filter)
            .populate({ path: 'distributor', select: '-password' })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit),
            WithdrawalRequest.countDocuments(filter)
        ])

        res.status(200).json({
            withdrawalRequests,
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

export const updateWithdrawalRequestStatus = async (req: AuthRequest, res: Response, next: NextFunction) => {
    
    try{
        const withdrawalRequest = await WithdrawalRequest.findById(req.params.id)
        .populate({
            path: 'distributor',
            select: '-password'
        });

        if(!withdrawalRequest) {
            return res.status(404).json({ message: "Withdrawal Request not found" });
        }

        if(withdrawalRequest.distributor_id.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Unauthorized' })
        }

        const newStatus = req.body.status;
        const currentStatus = withdrawalRequest.status;

        // Allowed status transitions (cannot go backwards)
        const allowedTransitions: Record<string, string[]> = {
            pending: ["cancelled"],
            approved: ["cancelled"],
            completed: [],
            cancelled: [],
            rejected: [],
        };

        const allowedNextStatuses = allowedTransitions[currentStatus] || [];
        if (!allowedNextStatuses.includes(newStatus)) {
            return res.status(400).json({
                message: `Cannot update status from ${currentStatus} to ${newStatus}. Please reload the page`,
            });
        }

        withdrawalRequest.status = newStatus;
        await withdrawalRequest.save();

        return res.status(200).json({
            message: `Withdrawal Request successfully ${newStatus}`,
            withdrawalRequest
        });
    } catch(err) {
        next(err);
    }
}