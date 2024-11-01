import { Router } from 'express';
import { UserController } from '../controllers/userController';

const router = Router();

/**
 * User Routes
 */
router.post('/create', UserController.createUser);

export default router;
