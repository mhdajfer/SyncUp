import { NextFunction, Request, Response } from "express";
import { CustomError } from "./CustonError";
import { StatusCode } from "../Shared/Interfaces/StatusCode";

export const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("got here***************************");

  if (err.statusCode) {
    if (err instanceof CustomError) {
      res
        .status(err.statusCode)
        .json({ error: err.message, success: false, data: null });
    }
  } else {
    res
      .status(StatusCode.INTERNAL_SERVER_ERROR)
      .json({ error: "An unexpected error occurred. Please try again later." });
  }
};
