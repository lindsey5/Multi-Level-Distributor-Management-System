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

export const getDownlineDistributors = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try{
        const distributor = await Distributor.findById(req.user._id);

        if(!distributor) return res.status(404).json({ message: "Distributor not found" });

        const downlineDistributors = await Distributor.find({ parent_distributor_id: distributor._id, status: 'active' })
            .populate('parent_distributor')
            .select('-password');

        res.status(200).json({downlineDistributors })

    } catch (err) {
        next(err);
    }
}

export const updateDistributor = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try{
        const distributor = await Distributor.findById(req.user._id);

        if(!distributor){
            return res.status(404).json({ message: 'distributor not found.' });
        }

        distributor.set(req.body);
        await distributor.save();

        res.status(200).json({
            message: "You successfully updated your account",
            distributor
        })
    }catch(err){
        next(err);
    }
}

export const addWithdrawalMethod = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try{
        const distributor = await Distributor.findById(req.user._id);

        if(!distributor) return res.status(404).json({ message: 'Distributor not found' });

        const isExisting = distributor.withdrawal_methods.find(method => 
            method.type === req.body.type &&
            method.account_name === req.body.account_name && 
            method.account_number === req.body.account_number && 
            method.bank_name === req.body.bank_name
        )

        if(isExisting) return res.status(409).json({ message: 'Withdrawal Method already exists' });

        distributor.set({
            withdrawal_methods: [req.body, ...distributor.withdrawal_methods, ]
        })

        await distributor.save();
        const newMethod =distributor.withdrawal_methods[0];

        res.status(200).json({
            message: 'Withdrawal Method Successfully Added',
            withdrawalMethod: newMethod
        })

    }catch(err){
        next(err);
    }
}

export const deleteWithdrawalMethod = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try{
        const distributor = await Distributor.findById(req.user._id);

        if(!distributor) return res.status(404).json({ message: 'Distributor not found' });
        
        distributor.withdrawal_methods = distributor.withdrawal_methods.filter((method) => method._id.toString() !== req.params.id);

        await distributor.save();

        res.status(200).json({
            id: req.params.id,
            message: 'Withdrawal Method Successfully Deleted'
        })

    }catch(err){
        next(err);
    }
}