import mongoose, { Schema, Document, Model } from "mongoose";
import { StockTransferItemAttributes } from "./StockTransferItem";
import './User';

export interface StockTransferAttributes extends Document {
    transfer_no: string;
    sender_id?: mongoose.Types.ObjectId | null;
    receiver_id: mongoose.Types.ObjectId;
    items: StockTransferItemAttributes[];
    status: 'pending'| 'approved'| 'processing' | 'delivered' | 'received' |  'cancelled' | 'rejected'
}

const StockTransferSchema: Schema<StockTransferAttributes> = new Schema(
    {
        transfer_no: {
            type: String,
            unique: true,
        },
        sender_id: {
            type: Schema.Types.ObjectId,
            ref: "Admin",
            required: true,
        },

        receiver_id: {
            type: Schema.Types.ObjectId,
            ref: "Distributor",
            required: true,
        },
        status: {
            type: String,
            enum: ['pending', 'approved', 'processing', 'delivered', 'received', 'cancelled', 'rejected'],
            default: 'pending'
        }
    },
    {
        timestamps: true,
    }
);

StockTransferSchema.index({ createdAt: -1 });
StockTransferSchema.index({ status: 1, createdAt: -1 });
StockTransferSchema.index({ sender_id: 1, createdAt: -1 });
StockTransferSchema.index({ receiver_id: 1, createdAt: -1 });
StockTransferSchema.index({ sender_id: 1, status: 1, createdAt: -1 });

StockTransferSchema.virtual("sender", {
    ref: "User",
    localField: "sender_id",
    foreignField: "_id",
    justOne: true
});

StockTransferSchema.virtual("receiver", {
    ref: "Distributor",
    localField: "receiver_id",
    foreignField: "_id",
    justOne: true
});

StockTransferSchema.virtual("items", {
    ref: "StockTransferItem",          
    localField: "_id", 
    foreignField: "transfer_id",       
});

StockTransferSchema.set("toObject", { virtuals: true });
StockTransferSchema.set("toJSON", { virtuals: true });

const StockTransfer: Model<StockTransferAttributes> = mongoose.model(
    "StockTransfer",
    StockTransferSchema
);

export default StockTransfer;