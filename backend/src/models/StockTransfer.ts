import mongoose, { Schema, Document, Model } from "mongoose";

export interface StockTransferAttributes extends Document {
    sender_id?: mongoose.Types.ObjectId | null;
    receiver_id: mongoose.Types.ObjectId;
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