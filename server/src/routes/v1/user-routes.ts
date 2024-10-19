import { Router } from 'express';
import userController from '../../controllers/user-controller.ts';
const router = Router();

router.post('/', userController.createUser);
router.get('/:id', userController.getUser);
router.get('/', userController.getAllUsers);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

export default router;