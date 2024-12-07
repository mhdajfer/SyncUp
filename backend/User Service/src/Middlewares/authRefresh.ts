import { NextFunction, Request, Response } from "express";
import jwt, { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import { verifyRefreshToken } from "../Utils/Jwt";
import { StatusCode } from "../interfaces";

export default function authRefresh(
  req: Request & Partial<{ user: string | jwt.JwtPayload }>,
  res: Response,
  next: NextFunction
) {
  try {
    const token = req.body.refreshToken;
    if (!token)
      return res
        .status(StatusCode.UNAUTHORIZED)
        .json({ success: false, message: "Token not found", data: null });

    if (!process.env.REFRESH_SECRET)
      return res.status(StatusCode.BAD_REQUEST).json({
        success: false,
        message: "secret key not provided",
        data: null,
      });

    const user = verifyRefreshToken(token);

    console.log("token verified......", user.email);

    if (!user)
      return res
        .status(StatusCode.UNAUTHORIZED)
        .json({ success: false, message: "user not found", data: null });

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
