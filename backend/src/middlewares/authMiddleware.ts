import type { Response, NextFunction } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import Admin from "../models/Admin";
import Distributor from "../models/Distributor";
import { AuthRequest } from "../types/types";

export const requireAuth = (...allowedRoles: string[]) => {
    return async (req: AuthRequest, res: Response, next: NextFunction) => {
        const authHeader = req.headers.authorization;

        if (!authHeader?.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Access token required",
            });
        }

        const token = authHeader.split(" ")[1] || "";

        try {
            const decoded = jwt.verify(token , process.env.JWT_ACCESS_SECRET as string) as JwtPayload;

            let isAuthorized = false;

            for (const role of allowedRoles) {
                if (role === "admin") {
                    const admin = await Admin.findById(decoded._id);
                    if (admin) {
                        req.user = admin;
                        isAuthorized = true;
                        break;
                    }
                }

                if (role === "distributor") {
                    const distributor = await Distributor.findById(decoded._id);
                    if (distributor) {
                        req.user = distributor
                        isAuthorized = true;
                        break;
                    }
                }
            }

            if (!isAuthorized) {
                return res.status(401).json({
                    success: false,
                    message: "Access Denied"
                });
            }

            next();

        } catch (error: any) {
            console.log(error);
            return res.status(401).json({
                success: false,
                message: "Invalid or Expired Token",
                error: error.message
            });
        }
    };
};