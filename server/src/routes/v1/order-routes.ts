import { Router } from 'express';
import OrderController from '../../controllers/order-controller.ts';
import { isAuthenticated } from '../../middlewares/isAuthenticate.ts';

const router = Router();
 

//@ts-ignore
router.get('/', isAuthenticated, OrderController.getOrders);
//@ts-ignore
router.post('/checkout', isAuthenticated, OrderController.createCheckoutSession);
router.post('/webhook', OrderController.stripeWebhook);

export default router;