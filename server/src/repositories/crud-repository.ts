import { StatusCodes } from 'http-status-codes';
import { AppError } from '../utils/errors/app-error.ts';
import mongoose, { Document, Model } from 'mongoose';

class CrudRepository<T extends Document> {
    protected model: Model<T>;

    constructor(model: Model<T>) {
        this.model = model;
    }

    async create(data: Partial<T>) {
        const response = await this.model.create(data);
        return response;
    }

    async destroy(id: string){
        const response = await this.model.findByIdAndDelete(id);
        if (!response) {
            throw new AppError('Not able to find the resource', StatusCodes.NOT_FOUND);
        }
        return response;
    }

    async get(id: string){
        const response = await this.model.findById(id);
        if (!response) {
            throw new AppError('Not able to find the resource', StatusCodes.NOT_FOUND);
        }
        return response;
    }

    async getAll() {
        const response = await this.model.find();
        return response;
    }

    async update(id: string, data: Partial<T>) {
        const response = await this.model.findByIdAndUpdate(id, data, { new: true });
        if (!response) {
            throw new AppError('Not able to find the resource', StatusCodes.NOT_FOUND);
        }
        return response;
    }
}

export default CrudRepository;