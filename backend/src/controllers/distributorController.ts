import { NextFunction, Response } from "express";
import { AuthRequest } from "../types/types";
import Distributor from "../models/Distributor";

export const getDistributorBalance = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try{
        const distributor = await Distributor.findById(req.user._id);

        if(!distributor){
            return res.status(404).json({ message: 'distributor not found.' });
        }

        const wallet_balance = distributor.wallet_balance;

        res.status(200).json({ wallet_balance });

    }catch(err){
        next(err);
    }
}