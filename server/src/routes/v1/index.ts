import userRoutes from './user-routes.ts'; 
import { Router } from 'express';
import restaurantRoutes from './restaurant-routes.ts';
import menuRoutes from './menu-routes.ts';
import orderRoutes from './order-routes.ts';
const router = Router();

router.use('/user', userRoutes);
router.use('/restaurant', restaurantRoutes);
router.use('/menu', menuRoutes);
router.use('/order', orderRoutes);

export default router;
