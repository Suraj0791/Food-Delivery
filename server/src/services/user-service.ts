import UserRepository from "../repositories/user-repository.ts";
import { IUser, IUserDocument } from "../models/user.model.ts";
import { StatusCodes } from "http-status-codes";
import { AppError } from "../utils/errors/app-error.ts";

const userRepo = new UserRepository();

// Example usage
async function createUser(data: Partial<IUser>): Promise<IUser> {
    try {
        const newUser = await userRepo.create(data);
        return newUser;
    } catch (error) {
        console.error(error);
        throw new AppError('Error creating user', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function deleteUser(id: string): Promise<IUser | null> {
    try {
        const deletedUser = await userRepo.destroy(id);
        return deletedUser;
    } catch (error) {
        console.error(error);
        throw new AppError('Error deleting user', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function getUser(id: string): Promise<IUser | null> {
    try {
        const user = await userRepo.get(id);
        return user;
    } catch (error) {
        console.error(error);
        throw new AppError('Error fetching user', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function getAllUsers(): Promise<IUser[]> {
    try {
        const users = await userRepo.getAll();
        return users;
    } catch (error) {
        console.error(error);
        throw new AppError('Error fetching users', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function updateUser(id: string, data: Partial<IUser>): Promise<IUser | null> {
    try {
        const updatedUser = await userRepo.update(id, data);
        return updatedUser;
    } catch (error) {
        console.error(error);
        throw new AppError('Error updating user', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

export { createUser, deleteUser, getUser, getAllUsers, updateUser };