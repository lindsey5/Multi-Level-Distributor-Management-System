import type { NextFunction, Request, Response } from "express";
import Admin from "../models/Admin";
import { generateAccessToken, generateRefreshToken } from "../utils/auth";
import jwt from "jsonwebtoken";

export const adminLogin = async (req : Request, res : Response, next : NextFunction) => {
    try{
        const { email, password } = req.body;

        const admin = await Admin.findOne({ email });

        if(!admin) return res.status(404).json({ message: 'User not found.' });

        const isMatch = await admin.matchPassword(password);

        if (!isMatch)  return res.status(401).json({ success: false, message: "Incorrect password." });

        const accessToken = generateAccessToken(admin._id);
        const refreshToken = generateRefreshToken(admin._id);

        const { password: userPassword, _id, ...rest } = admin.toObject();

        res.status(200).json({
            success: true,
            admin: rest,
            token: { accessToken, refreshToken },
        });

    }catch(err){
        next(err);
    }
}

export const adminRefreshAccessToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(401).json({ success: false, message: "Refresh token required" });
        }

        const decoded: any = jwt.verify(
            refreshToken,
            process.env.JWT_REFRESH_SECRET || "test-jwt-refresh-secret-key"
        );

        const admin = await Admin.findById(decoded._id);

        if (!admin) {
            return res.status(404).json({ success: false, message: "Admin not found" });
        }

        const newAccessToken = generateAccessToken(admin._id);
        const newRefreshToken = generateRefreshToken(admin._id);

        const { password: userPassword, _id, ...rest } = admin.toObject();
        
        res.status(200).json({
            success: true,
            admin: rest,
            token: {
                accessToken: newAccessToken,
                refreshToken: newRefreshToken,
            },
        });
    } catch (err) {
        next(err);
    }
};