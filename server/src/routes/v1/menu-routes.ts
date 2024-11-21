import { Router } from 'express';
import MenuController from '../../controllers/menu-controller.ts';
import { isAuthenticated } from '../../middlewares/isAuthenticate.ts';
import multer from 'multer';

const upload = multer({ storage: multer.memoryStorage() });
const router = Router();

//@ts-ignore
router.post('/', isAuthenticated, upload.single('image'), MenuController.addMenu);
//@ts-ignore
router.put('/:id', isAuthenticated, upload.single('image'), MenuController.editMenu);

export default router;