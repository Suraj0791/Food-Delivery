import { RestrauntService } from "../services/index.ts";
import { Request, Response,NextFunction } from "express";



const restaurantService = RestrauntService;
class RestaurantController {
    async createRestaurant(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const restaurant = await restaurantService.createRestaurant(req.body, req.file as Express.Multer.File, req.id);
            res.status(201).json({ success: true, message: 'Restaurant Added', restaurant });
        } catch (error) {
            next(error);
        }
    }

    async getRestaurant(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const restaurant = await restaurantService.getRestaurant(req.id);
            res.status(200).json({ success: true, restaurant });
        } catch (error) {
            next(error);
        }
    }

    async updateRestaurant(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const restaurant = await restaurantService.updateRestaurant(req.body, req.file as Express.Multer.File, req.id);
            res.status(200).json({ success: true, message: 'Restaurant updated', restaurant });
        } catch (error) {
            next(error);
        }
    }

    async getRestaurantOrder(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const orders = await restaurantService.getRestaurantOrder(req.id);
            res.status(200).json({ success: true, orders });
        } catch (error) {
            next(error);
        }
    }

    async updateOrderStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const order = await restaurantService.updateOrderStatus(req.params.orderId, req.body.status);
            res.status(200).json({ success: true, status: order.status, message: 'Status updated' });
        } catch (error) {
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
            next(error);
        }
    }

    async getSingleRestaurant(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const restaurant = await restaurantService.getSingleRestaurant(req.params.id);
            res.status(200).json({ success: true, restaurant });
        } catch (error) {
            next(error);
        }
    }
}

export default new RestaurantController();