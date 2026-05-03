import mongoose, { Schema, Document, Model } from "mongoose";

export interface ResetTokenAttributes extends Document {
    distributor_id: mongoose.Types.ObjectId;
    resetToken: string;
    resetTokenExpires: Date;
}

const ResetTokenSchema: Schema<ResetTokenAttributes> = new Schema(
    {
        distributor_id: {
            type: Schema.Types.ObjectId,
            required: true,
        },
        resetToken: {
            type: String,
            required: true,
        },
        resetTokenExpires: {
            type: Date,
            required: true
        }
    },
    {
        timestamps: true,
    }
);

const ResetToken: Model<ResetTokenAttributes> = mongoose.model(
    "ResetToken",
    ResetTokenSchema
);

export default ResetToken;