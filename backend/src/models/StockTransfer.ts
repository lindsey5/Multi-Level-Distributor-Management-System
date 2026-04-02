import mongoose, { Schema, Document, Model } from "mongoose";

export interface StockTransferAttributes extends Document {
    transfer_id: number;
    sender_id?: mongoose.Types.ObjectId | null;
    receiver_id: mongoose.Types.ObjectId;

    quantity: number;
    variant_id: mongoose.Types.ObjectId;
    price: number;
}

const StockTransferSchema: Schema<StockTransferAttributes> = new Schema(
    {
        transfer_id: {
            type: Number,
            required: true,
        },

        receiver_id: {
            type: Schema.Types.ObjectId,
            ref: "Distributor",
            required: true,
        },

        quantity: {
            type: Number,
            required: true,
        },

        variant_id: {
            type: Schema.Types.ObjectId,
            ref: "Variant",
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const StockTransfer: Model<StockTransferAttributes> = mongoose.model(
    "StockTransfer",
    StockTransferSchema
);

export default StockTransfer;