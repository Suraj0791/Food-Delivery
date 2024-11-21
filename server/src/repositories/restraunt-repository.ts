import { Restaurant, IRestaurant } from '../models/restraunt.model.ts';

export class RestaurantRepository {
  async create(data: Partial<IRestaurant>) {
    const restaurant = new Restaurant(data);
    await restaurant.save();
    return restaurant;
  }

  async findByUserId(userId: string) {
    return Restaurant.findOne({ user: userId });
  }

  async findById(restaurantId: string) {
    return Restaurant.findById(restaurantId);
  }

  async update(restaurantId: string, data: Partial<IRestaurant>) {
    return Restaurant.findByIdAndUpdate(restaurantId, data, { new: true });
  }

  async find(query: any) {
    return Restaurant.find(query);
  }
}