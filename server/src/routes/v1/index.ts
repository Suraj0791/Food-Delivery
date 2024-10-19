import userRoutes from './user-routes.ts'; 
import { Router } from 'express';
import restaurantRoutes from './restaurant-routes.ts';
import menuRoutes from './menu-routes.ts';
const router = Router();

router.use('/users', userRoutes);
router.use('/restaurants', restaurantRoutes);
router.use('/menus', menuRoutes);

export default router;
