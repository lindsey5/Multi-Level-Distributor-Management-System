import mongoose, { Schema, Document, Model } from "mongoose";
import { StockTransferItemAttributes } from "./StockTransferItem";

export interface StockTransferAttributes extends Document {
    sender_id?: mongoose.Types.ObjectId | null;
    receiver_id: mongoose.Types.ObjectId;
    items: StockTransferItemAttributes[];
    status: 'pending'| 'approved'| 'processing' | 'delivered' | 'received' |  'cancelled' | 'rejected'
}

const StockTransferSchema: Schema<StockTransferAttributes> = new Schema(
    {
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