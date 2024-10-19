import { Request, Response, NextFunction } from 'express';
import { createUser, deleteUser, getUser, getAllUsers, updateUser } from '../services/user-service.ts';
import { IUser } from '../models/user.model.ts';
import bcrypt from 'bcryptjs';

class UserController {
    async createUser(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { fullname, email, password, contact, address, city, country, profilePicture, admin } = req.body;
            const hashedPassword = await bcrypt.hash(password, 10);
            const userData: Partial<IUser> = { fullname, email, password: hashedPassword, contact, address, city, country, profilePicture, admin };
            const newUser = await createUser(userData);
            res.status(201).json(newUser);
        } catch (error) {
            next(error);
        }
    }

    async deleteUser(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            const deletedUser = await deleteUser(id);
            res.status(200).json(deletedUser);
        } catch (error) {
            next(error);
        }
    }

    async getUser(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            const user = await getUser(id);
            res.status(200).json(user);
        } catch (error) {
            next(error);
        }
    }

    async getAllUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const users = await getAllUsers();
            res.status(200).json(users);
        } catch (error) {
            next(error);
        }
    }

    async updateUser(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            const { fullname, email, password, contact, address, city, country, profilePicture, admin } = req.body;
            const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;
            const userData: Partial<IUser> = { fullname, email, password: hashedPassword, contact, address, city, country, profilePicture, admin };
            const updatedUser = await updateUser(id, userData);
            res.status(200).json(updatedUser);
        } catch (error) {
            next(error);
        }
    }
}

export default new UserController();