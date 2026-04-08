import type { NextFunction, Request, Response } from "express";
import Distributor from "../models/Distributor";
import { generateAccessToken, generateRefreshToken } from "../utils/auth";
import jwt from "jsonwebtoken";

export const login = async (req : Request, res : Response, next : NextFunction) => {
    try{
        const { email, password } = req.body;

        const distributor = await Distributor.findOne({ email, status: 'active' });

        if(!distributor) return res.status(404).json({ message: 'User not found.' });

        const isMatch = await distributor.matchPassword(password);

        if (!isMatch)  return res.status(401).json({ message: "Incorrect password." });

        const accessToken = generateAccessToken(distributor._id);
        const refreshToken = generateRefreshToken(distributor._id);

        const { password: userPassword, _id, ...rest } = distributor.toObject();

        res.status(200).json({
            distributor: rest,
            token: { accessToken, refreshToken },
        });

    }catch(err){
        next(err);
    }
}

export const refreshAccessToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(401).json({ message: "Refresh token required" });
        }

        const decoded: any = jwt.verify(
            refreshToken,
            process.env.JWT_REFRESH_SECRET || "test-jwt-refresh-secret-key"
        );

        const distributor = await Distributor.findById(decoded._id);

        if (!distributor) {
            return res.status(404).json({ message: "Distributor not found" });
        }

        const newAccessToken = generateAccessToken(distributor._id);
        const newRefreshToken = generateRefreshToken(distributor._id);

        const { password: userPassword, _id, ...rest } = distributor.toObject();
        
        res.status(200).json({
            distributor: rest,
            token: {
                accessToken: newAccessToken,
                refreshToken: newRefreshToken,
            },
        });
    } catch (err) {
        next(err);
    }
};