import { MenuRepository } from '../repositories/index.ts';
import uploadImageOnCloudinary from '../utils/imageUpload';
import { IMenu } from '../models/menu.model.ts';
import mongoose from 'mongoose';
import { Restaurant } from '../models/restraunt.model.ts';

const menuRepository = new MenuRepository();

export const addMenu = async (data: Partial<IMenu>, file: Express.Multer.File, userId: string): Promise<IMenu> => {
    if (!file) {
        throw new Error('Image is required');
    }

    const imageUrl = await uploadImageOnCloudinary(file);
    const menu = await menuRepository.create({ ...data, image: imageUrl });

    const restaurant = await Restaurant.findOne({ user: userId });
    if (!restaurant) {
        throw new Error('Restaurant not found');
    }
//@ts-ignore
    (restaurant.menus as mongoose.Schema.Types.ObjectId[]).push(menu._id);
    await restaurant.save();

    return menu;
};

export const editMenu = async (id: string, data: Partial<IMenu>, file?: Express.Multer.File): Promise<IMenu | null> => {
    const menu = await menuRepository.get(id);
    if (!menu) {
        throw new Error('Menu not found');
    }

    if (file) {
        const imageUrl = await uploadImageOnCloudinary(file);
        data.image = imageUrl;
    }

    return menuRepository.update(id, data);
};