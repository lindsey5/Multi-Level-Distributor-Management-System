import { NextFunction, Response } from "express";
import { AuthRequest } from "../types/types";
import Variant from "../models/Variant";
import ReturnRequest from "../models/ReturnRequest";

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