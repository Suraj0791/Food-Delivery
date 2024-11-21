import { Router } from 'express';
import RestaurantController from '../../controllers/restraunt-controller.ts';
import { isAuthenticated } from '../../middlewares/isAuthenticate.ts';
import multer from 'multer';

const upload = multer({ storage: multer.memoryStorage() });
const router = Router();

//@ts-ignore
router.post('/', isAuthenticated, upload.single('imageFile'), RestaurantController.createRestaurant);
//@ts-ignore
router.get('/', isAuthenticated, RestaurantController.getRestaurant);
//@ts-ignore

router.put('/', isAuthenticated, upload.single('imageFile'), RestaurantController.updateRestaurant);
//@ts-ignore

router.get('/orders', isAuthenticated, RestaurantController.getRestaurantOrder);
//@ts-ignore

router.put('/orders/:orderId', isAuthenticated, RestaurantController.updateOrderStatus);
//@ts-ignore

router.get('/search/:searchText?', RestaurantController.searchRestaurant);
//@ts-ignore

router.get('/:id', RestaurantController.getSingleRestaurant);

export default router;