import { RestaurantRepository } from '../repositories/index.ts';
import { IRestaurant } from '../models/restraunt.model.ts';
import uploadImageOnCloudinary from '../utils/imageUpload.ts';
import { Order } from '../models/order.model';

const restaurantRepo = new RestaurantRepository();

export const createRestaurant = async (data: Partial<IRestaurant>, file: Express.Multer.File, userId: string) => {
    //@ts-check
    const existingRestaurant = await restaurantRepo.findByUserId(userId);
    if (existingRestaurant) {
        throw new Error('Restaurant already exists for this user');
    }

    if (!file) {
        throw new Error('Image is required');
    }

    const imageUrl = await uploadImageOnCloudinary(file);
    const restaurant = await restaurantRepo.create({
        ...data,
        //@ts-ignore
        user: userId,
        imageUrl,
        //@ts-ignore
        cuisines: JSON.parse(data.cuisines as string),
    });

    return restaurant;
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
        //@ts-ignore
        data.cuisines = JSON.parse(data.cuisines as string);
    }
    //@ts-ignore
    return restaurantRepo.update(restaurant._id, data);
};

export const getRestaurantOrder = async (userId: string) => {
    const restaurant = await restaurantRepo.findByUserId(userId);
    if (!restaurant) {
        throw new Error('Restaurant not found');
    }

    return Order.find({ restaurant: restaurant._id }).populate('restaurant').populate('user');
};

export const updateOrderStatus = async (orderId: string, status: string) => {
    const order = await Order.findById(orderId);
    if (!order) {
        throw new Error('Order not found');
    }
//@ts-ignore
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
   //@ts-ignore
    return restaurantRepo.search(query);
};

export const getSingleRestaurant = async (restaurantId: string) => {
    const restaurant = await restaurantRepo.get(restaurantId);
    if (!restaurant) {
        throw new Error('Restaurant not found');
    }
    return restaurant.populate({
        path: 'menus',
        options: { sort: { createdAt: -1 } },
    });
};