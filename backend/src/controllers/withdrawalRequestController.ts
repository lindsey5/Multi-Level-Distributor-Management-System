import { NextFunction, Response } from "express";
import { AuthRequest } from "../types/types";
import WithdrawalRequest from "../models/WithdrawalRequest";
import Distributor from "../models/Distributor";

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