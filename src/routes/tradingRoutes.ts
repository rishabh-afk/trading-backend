import { Router } from 'express';
import { TradingController } from '../controllers/tradingController';

const router = Router();

router.get('/get-details', TradingController.getTradingDetails);

export default router;
