import { NextFunction, Request, Response } from "express";
import jwt, { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import { verifyRefreshToken } from "../Utils/Jwt";

export default function authRefresh(
  req: Request & Partial<{ user: string | jwt.JwtPayload }>,
  res: Response,
  next: NextFunction
) {
  try {
    const token = req.body.refreshToken;
    if (!token)
      return res
        .status(401)
        .json({ success: false, message: "Token not found", data: null });

    if (!process.env.REFRESH_SECRET)
      return res.status(404).json({
        success: false,
        message: "secret key not provided",
        data: null,
      });

    const user = verifyRefreshToken(token);

    console.log("token verified......", user.email);

    if (!user)
      return res
        .status(401)
        .json({ success: false, message: "user not found", data: null });

    req.user = user;
    next();
  } catch (error) {
    if (
      error instanceof TokenExpiredError ||
      error instanceof JsonWebTokenError
    ) {
      return res
        .status(401)
        .json({ success: false, message: "Token expired", data: null });
    }

    console.log(`Error during authentication: ${error}`);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error", data: null });
  }
}
