import { RestaurantRepository } from '../repositories/restraunt-repository.ts';
import { IRestaurant } from '../models/restraunt.model.ts';
import uploadImageOnCloudinary from '../utils/imageUpload.ts';
import { Order } from '../models/order.model.ts';
import mongoose from 'mongoose';

const restaurantRepo = new RestaurantRepository();

export const createRestaurant = async (data: Partial<IRestaurant>, userId: string, file : Express.Multer.File) => {
  try {
    console.log('Creating restaurant in service');
    const existingRestaurant = await restaurantRepo.findByUserId(userId);
    if (existingRestaurant) {
      throw new Error('Restaurant already exists for this user');
    }

    if(!file){
      console.log('Image is required');
      throw new Error('Image is required');
    }

    const imageUrl = await uploadImageOnCloudinary(file);

    
    console.log('data:in service ', data.cuisines,data.restaurantName,data.city,data.country,data.deliveryTime);
    const restaurant = await restaurantRepo.create({
      ...data,
      user: new mongoose.Types.ObjectId(userId),
      imageUrl,
      cuisines: JSON.parse(data.cuisines as unknown as string),
    });
    console.log('Restaurant created:', restaurant);
    return restaurant;
  } catch (error) {
    throw error;
  }
};

export const getRestaurant = async (userId: string) => {
  const restaurant = await restaurantRepo.findByUserId(userId);
  if (!restaurant) {
    throw new Error('Restaurant not found');
  }
  return restaurant.populate('menus');
};

export const updateRestaurant = async (data: Partial<IRestaurant>, file: Express.Multer.File | undefined, userId: string) => {
  const restaurant = await restaurantRepo.findByUserId(userId);
  if (!restaurant) {
    throw new Error('Restaurant not found');
  }

  if (file) {
    const imageUrl = await uploadImageOnCloudinary(file);
    data.imageUrl = imageUrl;
  }

  if (data.cuisines) {
    data.cuisines = JSON.parse(data.cuisines as unknown as string);
  }

  return restaurantRepo.update((restaurant._id as mongoose.Types.ObjectId).toString(), data);
};

export const getRestaurantOrder = async (userId: string) => {
  const restaurant = await restaurantRepo.findByUserId(userId);
  if (!restaurant) {
    throw new Error('Restaurant not found');
  }

  return Order.find({ restaurant: restaurant._id }).populate('restaurant').populate('user');
};

export const updateOrderStatus = async (orderId: string, status: 'pending' | 'confirmed' | 'preparing' | 'outfordelivery' | 'delivered') => {
  const order = await Order.findById(orderId);
  if (!order) {
    throw new Error('Order not found');
  }

  order.status = status;
  await order.save();
  return order;
};

export const searchRestaurant = async (searchText: string, searchQuery: string, selectedCuisines: string[]) => {
  const query: any = {};

  if (searchText) {
    query.$or = [
      { restaurantName: { $regex: searchText, $options: 'i' } },
      { city: { $regex: searchText, $options: 'i' } },
      { country: { $regex: searchText, $options: 'i' } },
    ];
  }

  if (searchQuery) {
    query.$or = [
      { restaurantName: { $regex: searchQuery, $options: 'i' } },
      { cuisines: { $regex: searchQuery, $options: 'i' } },
    ];
  }

  if (selectedCuisines.length > 0) {
    query.cuisines = { $in: selectedCuisines };
  }

  return restaurantRepo.find(query);
};

export const getSingleRestaurant = async (restaurantId: string) => {
  const restaurant = await restaurantRepo.findById(restaurantId);
  if (restaurant) {
    await restaurant.populate({
      path: 'menus',
      options: { sort: { createdAt: -1 } },
    });
  }
  if (!restaurant) {
    throw new Error('Restaurant not found');
  }
  return restaurant;
};