import { Request, Response, NextFunction } from 'express';
import * as restaurantService from '../services/restraunt-service.ts';
declare module 'express' {
    export interface Request {
      userId?: string;
    }
  }
import multer from 'multer';

const upload = multer();



  class RestaurantController {
    async createRestaurant(req: Request, res: Response, next: NextFunction): Promise<void> {
      try {
        console.log('Request received for creating restaurant');
        const userId = req.id;
        if (!userId) {
          throw new Error('User ID is required');
        }
        console.log('User ID:', userId);
  
        const data  = req.body;
        const file = req.file;
        console.log('Data received:', data);
  
        if (!file) {
          console.error('File is missing in the request');
          throw new Error('File is required');
        } else {
          console.log('File received:', file);
        }
        
        const restaurant = await restaurantService.createRestaurant(data, userId, file);
        res.status(201).json({ success: true, message: 'Restaurant created', restaurant });
      } catch (error) {
        console.error('Error creating restaurant:', error);
        next(error);
      }
    }
  

  async getRestaurant(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.id;
      if (!userId) {
        throw new Error('User ID is required');
      }
      const restaurant = await restaurantService.getRestaurant(userId);
      res.status(200).json({ success: true, restaurant });
    } catch (error) {
      console.error('Error getting restaurant:', error);
      next(error);
    }
  }

  async updateRestaurant(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.id;
      if (!userId) {
        throw new Error('User ID is required');
      }
      const restaurant = await restaurantService.updateRestaurant(req.body, req.file as Express.Multer.File, userId);
      res.status(200).json({ success: true, message: 'Restaurant updated', restaurant });
    } catch (error) {
      console.error('Error updating restaurant:', error);
      next(error);
    }
  }

  async getRestaurantOrder(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.id;
      if (!userId) {
        throw new Error('User ID is required');
      }
      const orders = await restaurantService.getRestaurantOrder(userId);
      res.status(200).json({ success: true, orders });
    } catch (error) {
      console.error('Error getting restaurant orders:', error);
      next(error);
    }
  }

  async updateOrderStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const order = await restaurantService.updateOrderStatus(req.params.orderId, req.body.status);
      res.status(200).json({ success: true, status: order.status, message: 'Status updated' });
    } catch (error) {
      console.error('Error updating order status:', error);
      next(error);
    }
  }

  async searchRestaurant(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const searchText = req.params.searchText || '';
      const searchQuery = req.query.searchQuery as string || '';
      const selectedCuisines = (req.query.selectedCuisines as string || '').split(',').filter(cuisine => cuisine);
      const restaurants = await restaurantService.searchRestaurant(searchText, searchQuery, selectedCuisines);
      res.status(200).json({ success: true, data: restaurants });
    } catch (error) {
      console.error('Error searching restaurants:', error);
      next(error);
    }
  }

  async getSingleRestaurant(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const restaurant = await restaurantService.getSingleRestaurant(req.params.id);
      res.status(200).json({ success: true, restaurant });
    } catch (error) {
      console.error('Error getting single restaurant:', error);
      next(error);
    }
  }
}

export default new RestaurantController();