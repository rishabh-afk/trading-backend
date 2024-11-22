import colors from "colors";
import dotenv from "dotenv";
import { KiteConnect } from "kiteconnect";
import { strings } from "../config/messages";
import { ApiResponse } from "../utils/ApiResponse";
import CustomError from "../middlewares/CustomError";
import { TradingPoints } from "../config/types/points";
import { Request, Response, NextFunction } from "express";
import { TradingService } from "../services/tradingServices";
import moment from "moment";

// Load environment variables from .env file
dotenv.config();

const apiKey = process.env.API_KEY as string;
const apiSecret = process.env.API_SECRET as string;

if (!apiKey || !apiSecret) {
  throw new Error("API_KEY and API_SECRET must be defined in .env file");
}

const kc = new KiteConnect({ api_key: apiKey });
let accessToken: string | null = null; // Temporary storage for the access token

export class TradingController {
  /**
   * Create a new user
   * @param {Request} req - The request object
   * @param {Response} res - The response object
   * @param {NextFunction} next - The next middleware function
   */
  static async getTradingDetails(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { high, low, close, currentPrice } = req.body;

      // Check if required fields are present
      if (
        high === undefined ||
        low === undefined ||
        close === undefined ||
        currentPrice === undefined
      ) {
        throw new CustomError(
          "Missing required fields: high, low, close, currentPrice",
          400
        );
      }

      // Calculate the trading points
      const points: TradingPoints = await TradingService.CalculatePoints(
        high,
        low,
        close
      );

      // Print all calculated values
      console.log(
        colors.cyan(`Calculated Points:
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
                S4: ${points.s4}`)
      );

      // Determine action based on the current price
      const resp: any = await TradingService.DetermineAction(
        currentPrice,
        points.tc ?? 0,
        points.pivot ?? 0,
        points.bc ?? 0
      );

      const response = new ApiResponse(true, {}, resp?.message);
      res.status(200).json(response);
    } catch (error: any) {
      if (error instanceof CustomError) {
        const response = new ApiResponse(false, {}, error.message);
        res.status(error.status).json(response);
      } else {
        // Handle unexpected errors
        const response = new ApiResponse(
          false,
          { error: error.message },
          strings.ERROR
        );
        res.status(500).json(response);
      }
    }
  }

  /**
   * Handles the generation and redirection to the Keycloak login URL.
   * If an error occurs, it logs the error and redirects to a fallback login page.
   *
   * @param {Request} req - The incoming HTTP request.
   * @param {Response} res - The HTTP response object.
   * @param {NextFunction} next - The next middleware function in the chain.
   */
  static async getLoginURL(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const loginUrl = kc.getLoginURL();
      if (!loginUrl)
        throw new Error(
          "Failed to generate login URL. Login URL is undefined."
        );

      return res.redirect(loginUrl);
    } catch (error) {
      const errorMessage = (error as Error).message;
      return console.error(
        "Error generating or redirecting to Login URL:",
        errorMessage
      );
    }
  }

  /**
   * Create a new user
   * @param {Request} req - The request object
   * @param {Response} res - The response object
   * @param {NextFunction} next - The next middleware function
   */
  static async handleRedirection(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    try {
      const { type, status, request_token } = req.query;

      if (!request_token || typeof request_token !== "string") {
        console.error("Invalid or missing request token.");
        return res
          .status(400)
          .json({ error: "Invalid or missing request token." });
      }

      // Step 1: Generate session
      const session = await kc.generateSession(request_token, apiSecret);

      if (!session || !session.access_token) {
        console.error("Failed to generate session or missing access token.");
        return res.status(500).json({ error: "Failed to generate session." });
      }

      // Step 2: Set access token
      accessToken = session.access_token; // Save access token in a variable
      kc.setAccessToken(session.access_token);

      // Step 3: Fetch user profile
      const profile = await kc.getProfile();
      if (!profile) {
        console.error("Failed to fetch user profile.");
        return res.status(500).json({ error: "Failed to fetch user profile." });
      }
      return res.status(200).json({ message: "Success", profile });
    } catch (error) {
      console.error("Error handling redirection:", (error as Error).message);
      return res.status(500).json({ error: "An unexpected error occurred." });
    }
  }
  static async fetchData(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    try {
      if (!accessToken) {
        const loginUrl = kc.getLoginURL();
        if (!loginUrl) {
          return res
            .status(500)
            .json({ error: "Failed to generate login URL." });
        }
        return res.redirect(loginUrl);
      }

      // Set the stored access token for KiteConnect
      kc.setAccessToken(accessToken);

      // Fetch data using KiteConnect
      const instruments = ["NSE:RELIANCE"];
      const ohlc = await kc.getOHLC(instruments);

      res.status(200).json({ ohlc });
    } catch (error) {
      console.error("Error fetching data:", (error as Error).message);
      res.status(500).json({ error: "Failed to fetch data." });
    }
  }

  static async HistoricalData(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    try {
      if (!accessToken) {
        const loginUrl = kc.getLoginURL();
        if (!loginUrl) {
          return res
            .status(500)
            .json({ error: "Failed to generate login URL." });
        }
        return res.redirect(loginUrl);
      }

      // Set the stored access token for KiteConnect
      kc.setAccessToken(accessToken);

      // Define the instrument(s) to fetch data for
      const instrumentToken = "738561"; // Use the appropriate instrument token for Reliance or another stock
      const interval = "minute"; // You can change this to other intervals like "5minute", "15minute", etc.

      // Get the current date and the previous day for historical data
      const currentDate = moment().format("YYYY-MM-DD");
      const fromDate = moment(`${currentDate} 09:15:00`).toDate(); // Start from 9:15 AM
      const toDate = moment(`${currentDate} 15:30:00`).toDate(); // End at 3:30 PM

      // Fetch the historical data
      const historicalData = await kc.getHistoricalData(
        instrumentToken,
        interval,
        fromDate,
        toDate
      );

      // Return the historical data as a response
      res.status(200).json({
        success: true,
        historicalData,
      });
    } catch (error) {
      console.error("Error fetching data:", (error as Error).message);
      res.status(500).json({ error: "Failed to fetch historical data." });
    }
  }
}
