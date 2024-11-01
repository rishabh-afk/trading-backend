import { logger } from "../config/logger";
import { strings } from "../config/messages";
import { Request, Response, NextFunction } from "express";

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error(err.message);
  res
    .status(err.status || 500)
    .json({ success: false, message: err.message || strings.SERVER_ERROR });
};
