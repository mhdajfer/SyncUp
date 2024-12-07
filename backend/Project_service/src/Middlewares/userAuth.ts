import { NextFunction, Request, Response } from "express";
import jwt, { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import { StatusCode } from "../Interfaces";

export default function userAuth(
  req: Request & Partial<{ user: string | jwt.JwtPayload }>,
  res: Response,
  next: NextFunction
) {
  try {
    const token = req.header("Authorization");

    if (!token)
      return res
        .status(StatusCode.BAD_REQUEST)
        .json({ success: false, message: "Token not found", data: null });

    if (!process.env.JWT_AUTHSECRET)
      return res.status(StatusCode.BAD_REQUEST).json({
        success: false,
        message: "secret key not provided",
        data: null,
      });

    const user = jwt.verify(token, process.env.JWT_AUTHSECRET);

    if (!user)
      return res
        .status(StatusCode.BAD_REQUEST)
        .json({ success: false, message: "user not found", data: null });

    console.log("auth..........", user);

    req.user = user;
    next();
  } catch (error) {
    if (
      error instanceof TokenExpiredError ||
      error instanceof JsonWebTokenError
    ) {
      return res
        .status(StatusCode.UNAUTHORIZED)
        .json({ success: false, message: "Token expired", data: null });
    }

    console.log(`Error during authentication: ${error}`);
    return res
      .status(StatusCode.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: "Internal server error", data: null });
  }
}
