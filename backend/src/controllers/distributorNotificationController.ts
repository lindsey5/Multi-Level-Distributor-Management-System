import { Response, NextFunction } from "express";
import { AuthRequest } from "../types/types";
import DistributorNotification from "../models/DistributorNotification";
import '../models/StockTransfer';
import '../models/StockTransferItem';
import '../models/Variant';
import '../models/Product';

export const getDistributorNotifications = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try{
        const page = req.query.page ? Number(req.query.page) : 1;
        const limit = req.query.limit ? Number(req.query.limit) : 10;
        const skip = (page - 1) * limit; 

        const notifications = await DistributorNotification.find({
            distributor_id: req.user._id
        })
        .populate([
            {
                path: 'stockTransfer',
                populate: [
                    { path: 'sender', select: '-password' },
                    { path: 'receiver', select: '-password' },
                    {
                        path: 'items',
                        populate: {
                            path: 'variant',
                            populate: 'product'
                        }
                    }
                ]
            },
            {
                path: 'returnRequest',
                populate: [
                    {
                        path: 'items.variant',
                        populate: 'product'
                    },
                    {
                        path: 'distributor',
                        select: '-password'
                    }
                ]
            },
            {
                path: 'sales',
                populate: [
                    {
                        path: 'variant',
                        populate: "product"
                    },
                    { path: 'seller', select: '-password' }
                ]
            },
            {
                path: 'stockOrder',
                populate: [
                    {
                        path: 'items.variant',
                        populate: "product"
                    },
                    { path: 'distributor', select: '-password' }
                ]
            },
            {
                path: 'sponsoredItem',
                populate: [
                    {
                        path: 'variant',
                        populate: 'product'
                    },
                    { path: 'distributor', select: '-password' }
                ]
            }
        ])
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });
        const total = await DistributorNotification.countDocuments({ distributor_id: req.user._id })
        const unread = await DistributorNotification.countDocuments({ distributor_id: req.user._id, status: 'unread' });

        const totalPages = Math.ceil(total / limit);

        res.status(200).json({
            notifications,
            unread,
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

export const readNotification = async (req : AuthRequest, res: Response, next: NextFunction) => {
    try{
        const notification = await DistributorNotification.findById(req.params.id);

        if(!notification){
            return res.status(404).json({ message: 'Notification not found'});
        }

        if(notification.distributor_id.toString() !== req.user._id.toString()){
            return res.status(403).json({ message: 'Forbidden' });
        }

        notification.status = 'read';
        await notification.save();

        res.status(200).json({ message: 'Notification successfully read'});

    }catch(err){
        next(err)
    }
}

export const readAllNotifications = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try{
        
        await DistributorNotification.updateMany({ distributor_id: req.user._id }, { $set: { status: 'read' }});

        res.status(200).json({
            message: "All notifications successfully updated to read"
        })

    }catch(err){
        next(err);
    }
}