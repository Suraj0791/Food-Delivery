import mongoose, { Document, Model } from "mongoose";

export interface IUser {
    fullname: string;
    email: string;
    password: string;
    contact: number;
    address: string;
    city: string;
    zipCode: string;
    country: string;
    profilePicture: string;
    state: string;

    admin: boolean;
    lastLogin?: Date;
    isVerified?: boolean;
    resetPasswordToken?: string;
    resetPasswordTokenExpiresAt?: Date;
    verificationCode?: string;
    verificationCodeExpiresAt?: Date
}

export interface IUserDocument extends IUser, Document {
    createdAt: Date;
    updatedAt: Date;
}

const userSchema = new mongoose.Schema<IUserDocument>({
    fullname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    contact: {
        type: Number,
        required: true
    },
    address: {
        type: String,
        default: "Update your address"
    },
    city: {
        type: String,
        default: "Update your city"
    },
    country: {
        type: String,
        default: "Update your country"
    },
    profilePicture: {
        type: String,
        default: "",
    },
    zipCode: { type: String, required: true },
    state: { type: String, required: true },

    admin: { type: Boolean, default: false },
    // advanced authentication
    lastLogin: {
        type: Date,
        default: Date.now
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    resetPasswordToken: String,
    resetPasswordTokenExpiresAt: Date,
    verificationCode: String,
    verificationCodeExpiresAt: Date,
}, { timestamps: true });

export const User: Model<IUserDocument> = mongoose.model<IUserDocument>("User", userSchema);