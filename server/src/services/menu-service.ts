import { MenuRepository } from '../repositories/index.ts';
import uploadImageOnCloudinary from '../utils/imageUpload.ts';
import { IMenu } from '../models/menu.model.ts';
import mongoose from 'mongoose';
import { Restaurant } from '../models/restraunt.model.ts';

const menuRepository = new MenuRepository();

export const addMenu = async (data: Partial<IMenu>, file: Express.Multer.File, userId: string): Promise<IMenu> => {
  try {
    console.log('Adding menu in service');
    console.log('Data in service:', data);
    console.log('User ID in service:', userId);

    if (!file) {
      throw new Error('Image is required');
    }

    const imageUrl = await uploadImageOnCloudinary(file);
    const menu = await menuRepository.create({ ...data, image: imageUrl });

    const restaurant = await Restaurant.findOne({ user: userId });
    if (!restaurant) {
      throw new Error('Restaurant not found');
    }

    (restaurant.menus as mongoose.Schema.Types.ObjectId[]).push(menu._id as mongoose.Schema.Types.ObjectId);
    await restaurant.save();

    console.log('Menu added:', menu);
    return menu;
  } catch (error) {
    console.error('Error in addMenu service:', error);
    throw error;
  }
};

export const editMenu = async (id: string, data: Partial<IMenu>, file?: Express.Multer.File): Promise<IMenu | null> => {
  try {
    console.log('Editing menu in service');
    console.log('Data in service:', data);

    const menu = await menuRepository.get(id);
    if (!menu) {
      throw new Error('Menu not found');
    }

    if (file) {
      const imageUrl = await uploadImageOnCloudinary(file);
      data.image = imageUrl;
    }

    const updatedMenu = await menuRepository.update(id, data);
    console.log('Menu updated:', updatedMenu);
    return updatedMenu;
  } catch (error) {
    console.error('Error in editMenu service:', error);
    throw error;
  }
};

export const getMenuByRestaurantId = async (restaurantId: string) => {
  return menuRepository.findByRestaurantId(restaurantId);
};