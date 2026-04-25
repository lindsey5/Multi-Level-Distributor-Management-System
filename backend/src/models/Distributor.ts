import mongoose, { Schema, Document, Model } from "mongoose";
import bcrypt from "bcrypt";
import { hashPassword } from "../utils/auth";

interface WithdrawalMethod extends Document{
    type: "bank" | "gcash" | "maya";
    account_name: string;
    account_number: string;
    bank_name?: string;
    is_default: boolean;
    createdAt?: Date;
}

export interface DistributorAttributes extends Document {
    distributor_id: string;
    parent_distributor_id: mongoose.Types.ObjectId | null;
    distributor_name: string;
    commission_rate: number;
    wallet_balance: number;
    withdrawal_methods: WithdrawalMethod[];
    email: string;
    password: string;
    status: "active" | "deleted";
    
    matchPassword(plainPassword: string): Promise<boolean>;
}

const DistributorSchema: Schema<DistributorAttributes> = new Schema(
    {
        distributor_id: {
            type: String,
            unique: true,
        },
        parent_distributor_id: {
            type: Schema.Types.ObjectId,
            ref: 'Distributor',
            required: false
        },

        distributor_name: {
            type: String,
            required: [true, "Distributor name is required."],
            minlength: [1, "Distributor name must be between 1 and 100 characters."],
            maxlength: [100, "Distributor name must be between 1 and 100 characters."],
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

        withdrawal_methods: [
            {
                type: {
                    type: String,
                    enum: ["bank", "gcash", "maya"],
                    required: true,
                },

                account_name: {
                    type: String,
                    required: true,
                    trim: true,
                },

                account_number: {
                    type: String,
                    required: true,
                    trim: true,
                },

                bank_name: {
                    type: String,
                    required: function (this: any) {
                        return this.type === "bank";
                    },
                    trim: true,
                },

                is_default: {
                    type: Boolean,
                    default: false,
                },
            },
        ],

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

DistributorSchema.virtual("stocks", {
    ref: "DistributorStock",          
    localField: "_id", 
    foreignField: "distributor_id",       
});

DistributorSchema.virtual("parent_distributor", {
    ref: "Distributor",          
    localField: "_id", 
    foreignField: "parent_distributor_id",   
    justOne: true    
});

DistributorSchema.set("toObject", { virtuals: true });
DistributorSchema.set("toJSON", { virtuals: true });

DistributorSchema.pre("save", async function (next) {
    const distributor = this as any;

    if (!distributor.distributor_id) {
        let unique = false;
        while (!unique) {
            const randomId = `DIST-${Math.floor(100000 + Math.random() * 900000)}`;
            
            const existing = await Distributor.findOne({ distributor_id: randomId });
            if (!existing) {
                distributor.distributor_id = randomId;
                unique = true;
            }
        }
    }

    // Hash password if modified
    if (distributor.isModified("password")) {
        distributor.password = await hashPassword(distributor.password);
    }

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