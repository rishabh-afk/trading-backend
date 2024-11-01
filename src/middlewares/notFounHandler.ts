import { strings } from "../config/messages";
import { Request, Response, NextFunction } from "express";

export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(404).json({ success: false, message: strings.ROUTE_NOT_FOUND });
};
