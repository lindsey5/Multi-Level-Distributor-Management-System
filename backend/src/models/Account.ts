import mongoose, { Schema, Document, Model } from "mongoose";
import bcrypt from 'bcrypt';

export interface AdminAttributes extends Document {
  email: string;
  password: string;
  firstname: string;
  lastname: string;
  wallet_balance: number;
}

const AdminSchema: Schema<AdminAttributes> = new Schema(
    {
        email: {
            type: String,
            required: [true, "Email is required."],
            unique: true,
            trim: true,
            lowercase: true,
        },

        password: {
            type: String,
            required: [true, "Password is required."],
        },

        firstname: {
            type: String,
            required: [true, "Firstname is required."],
            trim: true,
        },

        lastname: {
            type: String,
            required: [true, "Lastname is required."],
            trim: true,
        },

        wallet_balance: {
            type: Number,
            default: 0,
            min: [0, "Wallet balance cannot be negative."],
        },
    },
    {
        timestamps: true,
    }
);

AdminSchema.pre("save", async function (next) {
    const Admin = this;

    if (!Admin.isModified("password")) return next();

    const salt = await bcrypt.genSalt(10);
    Admin.password = await bcrypt.hash(Admin.password, salt);

    next();
});

AdminSchema.methods.matchPassword = async function (
    plainPassword: string
): Promise<boolean> {
    return await bcrypt.compare(plainPassword, this.password);
};

const Admin: Model<AdminAttributes> = mongoose.model<AdminAttributes>(
    "Admin",
    AdminSchema
);

export default Admin;