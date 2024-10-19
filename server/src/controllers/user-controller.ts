import { Request, Response, NextFunction } from 'express';
import { signup, login, verifyEmail, forgotPassword, resetPassword, checkAuth, updateProfile } from '../services/user-service.ts';
import cloudinary from '../utils/cloudinary.ts';


class UserController {
    async signup(req: Request, res: Response, next: NextFunction) {
        try {
            //@ts-ignore
            const user = await signup(req.body, res);
            res.status(201).json({
                success: true,
                message: 'Account created successfully',
                user: { ...user.toObject(), password: undefined },
            });
        } catch (error) {
            next(error);
        }
    }

    async login(req: Request, res: Response, next: NextFunction){
        try {
            //@ts-ignore
            const { email, password } = req.body;
            //@ts-ignore
            const user = await login(email, password, res);
            res.status(200).json({
                success: true,
                message: `Welcome back ${user.fullname}`,
                user: { ...user.toObject(), password: undefined },
            });
        } catch (error) {
            next(error);
        }
    }

    async verifyEmail(req: Request, res: Response, next: NextFunction) {
        try {
            const { verificationCode } = req.body;
            const user = await verifyEmail(verificationCode);
            res.status(200).json({
                success: true,
                message: 'Email verified successfully.',
                user: { ...user.toObject(), password: undefined },
            });
        } catch (error) {
            next(error);
        }
    }

    async forgotPassword(req: Request, res: Response, next: NextFunction) {
        try {
            const { email } = req.body;
            await forgotPassword(email);
            res.status(200).json({
                success: true,
                message: 'Password reset link sent to your email',
            });
        } catch (error) {
            next(error);
        }
    }

    async resetPassword(req: Request, res: Response, next: NextFunction) {
        try {
            const { token } = req.params;
            const { newPassword } = req.body;
            await resetPassword(token, newPassword);
            res.status(200).json({
                success: true,
                message: 'Password reset successfully.',
            });
        } catch (error) {
            next(error);
        }
    }

    async checkAuth(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.id;
            const user = await checkAuth(userId);
            if (!user) {
                //@ts-ignore
                return res.status(404).json({
                    success: false,
                    message: 'User not found',
                });
            }
            res.status(200).json({
                success: true,
                user: { ...user.toObject(), password: undefined },
            });
        } catch (error) {
            next(error);
        }
    }

    async updateProfile(req: Request, res: Response, next: NextFunction){
        try {
            const userId = req.id;
            const { fullname, email, address, city, country, profilePicture } = req.body;
            let cloudResponse: any;
            if (profilePicture) {
                cloudResponse = await cloudinary.uploader.upload(profilePicture);
            }
            const updatedData = { fullname, email, address, city, country, profilePicture: cloudResponse?.secure_url };
            const user = await updateProfile(userId, updatedData);
            res.status(200).json({
                success: true,
                user: { ...user.toObject(), password: undefined },
                message: 'Profile updated successfully',
            });
        } catch (error) {
            next(error);
        }
    }

    async logout(_: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            res.clearCookie('token').status(200).json({
                success: true,
                message: 'Logged out successfully.',
            });
        } catch (error) {
            next(error);
        }
    }
}

export default new UserController();