import { Request, Response, NextFunction } from 'express';
import { getOrders, createCheckoutSession, stripeWebhook } from '../services/order-service.ts';

class OrderController {
    async getOrders(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const orders = await getOrders(req.id);
            res.status(200).json({
                success: true,
                orders,
            });
        } catch (error) {
            next(error);
        }
    }

    async createCheckoutSession(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            console.log('User ID:', req.id); // Log the user ID

            
            const session = await createCheckoutSession(req.body, req.id);
    
            res.status(200).json({
                session,
            });
        } catch (error) {
            next(error);
        }
    }

    async stripeWebhook(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const signature = req.headers['stripe-signature'] as string;
            const payload = JSON.stringify(req.body, null, 2);
            await stripeWebhook(payload, signature);
            res.status(200).send();
        } catch (error) {
            next(error);
        }
    }
}

export default new OrderController();