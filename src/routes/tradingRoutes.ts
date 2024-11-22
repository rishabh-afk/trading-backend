import { Router } from "express";
import { TradingController } from "../controllers/tradingController";

const router = Router();

router.post("/get-action", TradingController.getTradingDetails);

router.get("/login", TradingController.getLoginURL);

router.get("/redirect", TradingController.handleRedirection);

export default router;
