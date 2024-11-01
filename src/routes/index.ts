import { Router } from 'express';
import userRoutes from './userRoutes';
import tradingRoutes from './tradingRoutes';

const router = Router();

/**
 * @description Main route for user-related operations
 * @route /user
 */
router.use('/user', userRoutes);

/**
 * @description Main route for trading-related operations
 * @route /trading
 */
router.use('/trading', tradingRoutes);

export default router;
