import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { StatusCodes } from 'http-status-codes';
import UserRepository from '../repositories/user-repository.ts';
import { Response } from 'express';
import { IUser, IUserDocument } from '../models/user.model.ts';
import { AppError } from '../utils/errors/app-error.ts';
import { generateToken } from '../utils/generateToken.ts';
import { sendVerificationEmail, sendWelcomeEmail, sendPasswordResetEmail, sendResetSuccessEmail } from '../mailtrap/email.ts';
import { ServerConfig } from '../config/index.ts';
import { generateVerificationCode } from '../utils/generateVerificationcode.ts';

const userRepo = new UserRepository();
export const signup = async (data: Partial<IUser>, res: Response) => {
    const { fullname, email, password, contact } = data;

    if (!email) {
        throw new AppError('Email is required', StatusCodes.BAD_REQUEST);
    }
    let user = await userRepo.findByEmail(email);
    if (user) {
        throw new AppError('User already exists with this email', StatusCodes.BAD_REQUEST);
    }
    


    //@ts-ignore
    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationCode = generateVerificationCode();


    user = await userRepo.create({
        fullname,
        email,
        //@ts-ignore
        password: hashedPassword,
        contact: Number(contact),
        verificationCode,
        verificationCodeExpiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });
    //@ts-ignore
    generateToken(res, user);

    await sendVerificationEmail(email, verificationCode);
    return user;
};

export const login = async (data: Partial<IUser>, res: Response<any, Record<string, any>>) => {
    const { email, password } = data;
    if (!email) {
        throw new AppError('Email is required', StatusCodes.BAD_REQUEST);
    }
    if (!password) {
        throw new AppError('Password is required', StatusCodes.BAD_REQUEST);
    }
    const user = await userRepo.findByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
        throw new AppError('Incorrect email or password', StatusCodes.BAD_REQUEST);
    }
    generateToken(res, user);
    user.lastLogin = new Date();
    await user.save();

    return user;
};

export const verifyEmail = async (verificationCode: string) => {
    const user = await userRepo.findByverificationCode(verificationCode);
    if (!user) {
        throw new AppError('Invalid or expired verification token', StatusCodes.BAD_REQUEST);
    }

    user.isVerified = true;
    user.verificationCode = undefined;
    user.verificationCodeExpiresAt = undefined;
    await user.save();

    await sendWelcomeEmail(user.email, user.fullname);

    return user;
};



export const forgotPassword = async (email: string) => {
    const user = await userRepo.findByEmail(email);
    if (!user) {
        throw new AppError("User doesn't exist", StatusCodes.BAD_REQUEST);
    }

    const resetToken = crypto.randomBytes(40).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordTokenExpiresAt = new Date(Date.now() + 1 * 60 * 60 * 1000); // 1 hour
    await user.save();

    await sendPasswordResetEmail(user.email, `${ServerConfig.FRONTEND_URL}/resetpassword/${resetToken}`);
};

export const resetPassword = async (token: string, newPassword: string) => {
    const user = await userRepo.findByResetToken(token);
    if (!user) {
        throw new AppError('Invalid or expired reset token', StatusCodes.BAD_REQUEST);
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordTokenExpiresAt = undefined;
    await user.save();

    await sendResetSuccessEmail(user.email);
};

export const checkAuth = async (userId: string) => {
    return userRepo.get(userId);
};

export const updateProfile = async (userId: string, data: Partial<IUser>) => {
    return userRepo.update(userId, data);
};

export const getProfile = async (userId: string) => {
    return userRepo.get(userId);
  };