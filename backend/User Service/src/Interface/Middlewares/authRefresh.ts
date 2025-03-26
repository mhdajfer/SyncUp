import { NextFunction, Request, Response } from "express";
import jwt, { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import { verifyRefreshToken } from "../../Shared/Utils/Jwt";
import { StatusCode } from "../../Shared/interfaces";
import { CustomError } from "../../ErrorHandler/CustonError";

export default function authRefresh(
  req: Request & Partial<{ user: string | jwt.JwtPayload }>,
  res: Response,
  next: NextFunction
) {
  try {
    // Validate presence of refreshToken in request body
    const token = req.body?.refreshToken;
    if (!token) {
      throw new CustomError(
        "Refresh token not provided",
        StatusCode.UNAUTHORIZED
      );
    }

    // Ensure REFRESH_SECRET is configured
    if (!process.env.REFRESH_SECRET) {
      throw new CustomError(
        "Refresh secret key not found",
        StatusCode.BAD_REQUEST
      );
    }

    // Verify the refresh token
    const user = verifyRefreshToken(token); // Make sure this function throws CustomError on failure
    if (!user) {
      throw new CustomError(
        "Invalid or expired refresh token",
        StatusCode.UNAUTHORIZED
      );
    }

    // Attach user to request for downstream processing
    req.user = user;

    next(); // Proceed to the next middleware
  } catch (error) {
    // Handle JWT-specific errors
    if (
      error instanceof TokenExpiredError ||
      error instanceof JsonWebTokenError
    ) {
      return next(
        new CustomError(
          "refresh token expired or invalid",
          StatusCode.UNAUTHORIZED
        )
      );
    }

    console.error("Error during refresh token validation:", error);

    if (error instanceof CustomError) {
      return next(new CustomError(`${error.message}`, StatusCode.BAD_REQUEST));
    }

    // Generic fallback for unhandled errors
    return next(
      new CustomError("Internal server error", StatusCode.INTERNAL_SERVER_ERROR)
    );
  }
}
