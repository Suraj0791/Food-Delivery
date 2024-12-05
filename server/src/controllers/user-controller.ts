import { Request, Response, NextFunction } from 'express';
import { signup, login, verifyEmail, forgotPassword, resetPassword, checkAuth, updateProfile } from '../services/user-service.ts';
import cloudinary from '../utils/cloudinary.ts';


class UserController {
    async signup(req: Request, res: Response, next: NextFunction) {
        try {
            const data = req.body;
            //@ts-ignore
            const user = await signup(data,res);
            //res is the response that is being sent to the server . 
            //response is used by client to get the data from the server .
            //client checks the response to see if the data is being sent to the server or not .
            res.status(201).json({
                success: true,
                message: 'Account created successfully',
                //user is the data that is being sent to the server . the user data is being sent to the server in the form of json . .toObject is used to convert the data into the object format . password is set to undefined so that the password is not visible to the user .
                user: { ...user.toObject(), password: undefined },
            });
        } catch (error : any) {
            console.log(error)
            next(error);
        }
    }

    async login(req: Request, res: Response, next: NextFunction){
        try {
            const data = req.body;
            const user = await login(data, res);
            res.status(200).json({
                success: true,
                message: `Welcome back ${user.fullname}`,
                user: { ...user.toObject(), password: undefined },
            });
        } catch (error : any) {
            next(error);
        }
    }

    async verifyEmail(req: Request, res: Response, next: NextFunction) {
        console.log("request received")
        try {
            const { verificationCode } = req.body;
            console.log(verificationCode)
            const user = await verifyEmail(verificationCode);
            res.status(200).json({
                success: true,
                message: 'Email verified successfully.',
                user: { ...user.toObject(), password: undefined },
            });
        } catch (error : any) {
            console.log(error)
            next(error);
        }
    }

    async getProfile(req: Request, res: Response, next: NextFunction) {
        try {
          const userId = req.id;
          console.log(userId);
          const user = await checkAuth(userId);
          console.log(user);
          if (!user) {
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
            const { fullname, email, address, city, state, zipCode, country, profilePicture } = req.body;
            let cloudResponse: any;
            if (profilePicture) {
                cloudResponse = await cloudinary.uploader.upload(profilePicture);
            }
            const updatedData = {
                fullname,
                email,
                address,
                city,
                state,
                zipCode,
                country,
                profilePicture: cloudResponse?.secure_url,
              };
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