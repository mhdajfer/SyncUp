import { NextFunction, Request, Response } from "express";
import { CustomError } from "./CustonError";

export const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err.statusCode) {
    if (err instanceof CustomError) {
      res
        .status(err.statusCode)
        .json({ error: err.message, success: false, data: null });
    }
  } else {
    res
      .status(500)
      .json({ error: "An unexpected error occurred. Please try again later." });
  }
};
