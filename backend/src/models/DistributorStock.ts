import mongoose, { Schema, Document, Model } from "mongoose";

export interface DistributorStockAttributes extends Document {
    distributor_id: mongoose.Types.ObjectId;
    variant_id: mongoose.Types.ObjectId;
    quantity: number;
}

const DistributorStockSchema: Schema<DistributorStockAttributes> = new Schema(
    {
        distributor_id: {
            type: Schema.Types.ObjectId,
            ref: "Distributor",
            required: true,
        },

        variant_id: {
            type: Schema.Types.ObjectId,
            ref: "Variant",
            required: true,
        },

        quantity: {
            type: Number,
            required: true,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

const DistributorStock: Model<DistributorStockAttributes> = mongoose.model(
    "DistributorStock",
    DistributorStockSchema
);

export default DistributorStock;