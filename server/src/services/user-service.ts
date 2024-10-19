import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { StatusCodes } from 'http-status-codes';
import UserRepository from '../repositories/user-repository';
import { IUser, IUserDocument } from '../models/user.model';
import { AppError } from '../utils/errors/app-error';
import { generateToken } from '../utils/generateToken';
import { sendVerificationEmail, sendWelcomeEmail, sendPasswordResetEmail, sendResetSuccessEmail } from '../mailtrap/email';
import { ServerConfig } from '../config';

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
    const verificationToken = crypto.randomBytes(40).toString('hex');

    user = await userRepo.create({
        fullname,
        email,
        //@ts-ignore
        password: hashedPassword,
        contact: Number(contact),
        verificationToken,
        verificationTokenExpiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });
    //@ts-ignore
    generateToken(res, user);
    await sendVerificationEmail(email, verificationToken);

    return user;
};

export const login = async (email: string, password: string, res: Response) => {
    const user = await userRepo.findByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
        throw new AppError('Incorrect email or password', StatusCodes.BAD_REQUEST);
    }
    //@ts-ignore
    generateToken(res, user);
    user.lastLogin = new Date();
    await user.save();

    return user;
};

export const verifyEmail = async (verificationCode: string) => {
    const user = await userRepo.findByVerificationToken(verificationCode);
    if (!user) {
        throw new AppError('Invalid or expired verification token', StatusCodes.BAD_REQUEST);
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiresAt = undefined;
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