import { Router } from 'express';
import { TradingController } from '../controllers/tradingController';

const router = Router();

router.post('/get-action', TradingController.getTradingDetails);

export default router;
