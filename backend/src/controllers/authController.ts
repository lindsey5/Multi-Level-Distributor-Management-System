import type { NextFunction, Request, Response } from "express";
import Distributor from "../models/Distributor";
import { generateAccessToken, generateRefreshToken, generateResetToken } from "../utils/auth";
import jwt from "jsonwebtoken";
import { AuthRequest } from "../types/types";
import EmailService from "../services/EmailService";
import ResetToken from "../models/ResetToken";

export const login = async (req : Request, res : Response, next : NextFunction) => {
    try{
        const { email, password } = req.body;

        const distributor = await Distributor.findOne({ email, status: "active" })
        .populate({
            path: "parent_distributor",
            select: "-password -_id",
        });
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

        const distributor = await Distributor.findOne({ _id: decoded._id, status: 'active' })
        .populate({
            path: "parent_distributor",
            select: "-password -_id",
        });

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

export const changePassword = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try{
        const { currentPassword, newPassword } = req.body;

        if(!currentPassword || !newPassword){
            return res.status(400).json({ message: "Missing required password fields" });
        }

        const distributor = await Distributor.findById(req.user._id);

        if(!distributor) return res.status(404).json({ message: "User not found" });

        const isMatch = await distributor.matchPassword(currentPassword);

        if (!isMatch)  return res.status(403).json({ message: "Incorrect current password." });

        const isSamePassword=  await distributor.matchPassword(newPassword);

        if(isSamePassword) return res.status(400).json({ message: 'New password must be different from current password' });

        distributor.password = newPassword;
        await distributor.save();

        res.status(200).json({ message: "Password successfully changed" })

    }catch(err) {
        next(err);
    }
}

export const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const { email } = req.body;

        if(!email) return res.status(400).json({ message: "Email is required" });

        const distributor = await Distributor.findOne({ email });

        if(!distributor) return res.status(404).json({ message: 'User not found.' });

        const token = generateResetToken(distributor._id);

        const resetLink = `${process.env.ORIGIN}/reset-password/${token}`;

        const isSent = await EmailService.sendResetEmail(distributor.email, distributor.distributor_name, resetLink);

        if(!isSent) return res.status(400).json({ message: "Error sending forgot password email" });

        await ResetToken.create({
            distributor_id: distributor._id,
            resetToken: token,
            resetTokenExpires: new Date(Date.now() + 15 * 60 * 1000)
        })

        res.status(200).json({
            message: "Password reset link has been sent to your email address. Please check your inbox."
        });
    }catch(err){
        next(err);
    }
}

export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const { resetToken, newPassword } = req.body;

        if (!resetToken) {
            return res.status(401).json({ message: "Reset token required" });
        }

        const decoded: any = jwt.verify(
            resetToken,
            process.env.JWT_RESET_SECRET || "test-jwt-reset-secret-key"
        );

        const distributor = await Distributor.findOne({ _id: decoded._id, status: 'active' });

        if(!distributor){
            return res.status(404).json({ message: "Distributor not found" });
        }

        const token = await ResetToken.findOne({
            distributor_id: distributor._id,
            resetToken: resetToken,
            resetTokenExpires: { $gt: new Date() }
        })

        if(!token) {
            return res.status(401).json({ message: "Reset Link Expired" });
        }

        await token.deleteOne();

        distributor.password = newPassword;
        await distributor.save();

        res.status(200).json({ message: "Password successfully reset" })

    } catch(err) {
        return res.status(401).json({ message: "Reset Link Expired" });
    }
}