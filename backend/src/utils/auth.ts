import bcrypt from 'bcrypt'
import jwt, { type SignOptions } from 'jsonwebtoken';
import mongoose from 'mongoose';

// Hash a plain password
export const hashPassword = async (password : string) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
};

// Generate JWT Access Token
export const generateAccessToken = (user_id : mongoose.Types.ObjectId): string => {
    if (!process.env.JWT_ACCESS_SECRET || !process.env.JWT_ACCESS_EXPIRES_IN) {
        throw new Error('JWT_SECRET is not defined in environment variables');
    }
    
    return jwt.sign(
        { _id: user_id },
        process.env.JWT_ACCESS_SECRET,
        { expiresIn: process.env.JWT_ACCESS_EXPIRES_IN as SignOptions } as SignOptions
    );
};

// Generate JWT Refresh Token
export const generateRefreshToken = (user_id: mongoose.Types.ObjectId): string => {
    if (!process.env.JWT_REFRESH_SECRET || !process.env.JWT_REFRESH_EXPIRES_IN) {
        throw new Error('JWT_SECRET is not defined in environment variables');
    }

    return jwt.sign(
        { _id: user_id },
        process.env.JWT_REFRESH_SECRET as string,
        { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN } as SignOptions
    );
};

// Generate JWT Reset Token
export const generateResetToken = (user_id : mongoose.Types.ObjectId): string => {
    if (!process.env.JWT_RESET_SECRET || !process.env.JWT_RESET_EXPIRES_IN) {
        throw new Error('JWT_SECRET is not defined in environment variables');
    }
    
    return jwt.sign(
        { _id: user_id },
        process.env.JWT_RESET_SECRET,
        { expiresIn: process.env.JWT_RESET_EXPIRES_IN as SignOptions } as SignOptions
    );
};
