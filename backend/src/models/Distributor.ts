import mongoose, { Schema, Document, Model } from "mongoose";
import bcrypt from "bcrypt";

export interface DistributorAttributes extends Document {
    parent_distributor_id?: number | null;
    creator?: number | null;
    distributor_name: string;
    commission_rate: number;
    wallet_balance: number;
    email: string;
    password: string;
    status: "active" | "deleted";
    
    matchPassword(plainPassword: string): Promise<boolean>;
}

const DistributorSchema: Schema<DistributorAttributes> = new Schema(
    {
        parent_distributor_id: {
            type: Number,
            required: false
        },

        creator: {
            type: Number,
            required: false
        },

        distributor_name: {
            type: String,
            required: [true, "agent name is required."],
            minlength: [1, "agent name must be between 1 and 100 characters."],
            maxlength: [100, "agent name must be between 1 and 100 characters."],
            trim: true,
        },

        commission_rate: {
            type: Number,
            required: true,
            default: 5,
        },

        wallet_balance: {
            type: Number,
            required: true,
            default: 0,
        },

        email: {
            type: String,
            required: [true, "email is required."],
            unique: true,
            lowercase: true,
            trim: true,
            minlength: [5, "email must be between 5 and 100 characters."],
            maxlength: [100, "email must be between 5 and 100 characters."],
            match: [/^\S+@\S+\.\S+$/, "invalid email address"],
        },

        password: {
            type: String,
            required: [true, "password is required"],
            minlength: [6, "password must be between 6 to 50 characters."],
            maxlength: [50, "password must be between 6 to 50 characters."],
        },

        status: {
            type: String,
            enum: ["active", "deleted"],
            default: "active",
            required: true,
        },
    },
    {
        timestamps: true, 
    }
);

DistributorSchema.pre("save", async function (next) {
    const distributor = this;

    if (!distributor.isModified("password")) return next();

    const salt = await bcrypt.genSalt(10);
    distributor.password = await bcrypt.hash(distributor.password, salt);

    next();
});

DistributorSchema.methods.matchPassword = async function (
    plainPassword: string
): Promise<boolean> {
    return await bcrypt.compare(plainPassword, this.password);
};

const Distributor: Model<DistributorAttributes> = mongoose.model(
    "Distributor",
    DistributorSchema
);

export default Distributor;