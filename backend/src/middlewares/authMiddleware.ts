import type { Response, NextFunction } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import Distributor from "../models/Distributor";
import { AuthRequest } from "../types/types";

export const requireAuth = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
        return res.status(401).json({
            message: "Access token required",
        });
    }

    const token = authHeader.split(" ")[1] || "";

    try {
        const decoded = jwt.verify(token , process.env.JWT_ACCESS_SECRET as string) as JwtPayload;
        const distributor = await Distributor.findById(decoded._id);

        if (!distributor) {
            return res.status(401).json({
                message: "Access Denied"
            });
        }

        req.user = distributor;

        next();

    } catch (error: any) {
        console.log(error);
        return res.status(401).json({
            message: "Invalid or Expired Token",
            error: error.message
        });
    }
};