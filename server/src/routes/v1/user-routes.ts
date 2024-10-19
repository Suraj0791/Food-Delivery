import { Router } from 'express';
import UserController from '../../controllers/user-controller';
import { isAuthenticated } from '../../middlewares/isAuthenticate';

const router = Router();


router.post('/signup', UserController.signup);
router.post('/login', UserController.login);
router.post('/verify-email', UserController.verifyEmail);
router.post('/forgot-password', UserController.forgotPassword);
router.post('/reset-password/:token', UserController.resetPassword);
//@ts-ignore
router.get('/check-auth', isAuthenticated, UserController.checkAuth);
//@ts-ignore
router.put('/update-profile', isAuthenticated, UserController.updateProfile);
router.post('/logout', UserController.logout);

export default router;