import colors from 'colors';
import { strings } from '../config/messages';
import { ApiResponse } from '../utils/ApiResponse';
import CustomError from '../middlewares/CustomError';
import { TradingPoints } from '../config/types/points';
import { Request, Response, NextFunction } from 'express';
import { TradingService } from '../services/tradingServices';

export class TradingController {
    /**
     * Create a new user
     * @param {Request} req - The request object
     * @param {Response} res - The response object
     * @param {NextFunction} next - The next middleware function
     */
    static async getTradingDetails(req: Request, res: Response, next: NextFunction) {
        try {
            const { high, low, close, currentPrice } = req.body;

            // Check if required fields are present
            if (high === undefined || low === undefined || close === undefined || currentPrice === undefined) {
                throw new CustomError("Missing required fields: high, low, close, currentPrice", 400);
            }

            // Calculate the trading points
            const points: TradingPoints = await TradingService.CalculatePoints(high, low, close);

            // Print all calculated values
            console.log(colors.cyan(`Calculated Points:
                Pivot: ${points.pivot}
                BC: ${points.bc}
                TC: ${points.tc}
                R1: ${points.r1}
                R2: ${points.r2}
                R3: ${points.r3}
                R4: ${points.r4}
                S1: ${points.s1}
                S2: ${points.s2}
                S3: ${points.s3}
                S4: ${points.s4}`));

            // Determine action based on the current price
            const resp: any = await TradingService.DetermineAction(currentPrice, points.tc ?? 0, points.pivot ?? 0, points.bc ?? 0);

            const response = new ApiResponse(true, {}, resp?.message);
            res.status(200).json(response);
        } catch (error: any) {
            if (error instanceof CustomError) {
                const response = new ApiResponse(false, {}, error.message);
                res.status(error.status).json(response);
            } else {
                // Handle unexpected errors
                const response = new ApiResponse(false, { error: error.message }, strings.ERROR);
                res.status(500).json(response);
            }
        }
    }
}
