import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { IUser } from "../interfaces/IUser";
import { StatusCode } from "../interfaces/StatusCode";

export default async (
  req: Request & Partial<{ user: Partial<IUser> }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.header("Authorization");

    if (token) {
      if (!process.env.JWT_AUTHSECRET)
        throw new Error("JWT_SECRET_KEY not found in .env file");

      const decode = jwt.verify(
        token,
        process.env.JWT_AUTHSECRET
      ) as JwtPayload;

      if (decode) {
        if (decode.isBlocked)
          return res
            .status(StatusCode.FORBIDDEN)
            .json({ success: false, message: "user is blocked" });
        if (decode.isDeleted)
          return res
            .status(StatusCode.FORBIDDEN)
            .json({ success: false, message: "user is deleted" });
        if (!decode.isVerified)
          return res
            .status(StatusCode.FORBIDDEN)
            .json({ success: false, message: "user is not verified" });

        req.user = decode;

        next();
      } else {
        res.status(StatusCode.UNAUTHORIZED).json({ error: "unauthorised" });
      }
    } else {
      res.status(StatusCode.UNAUTHORIZED).json({ error: "unauthorised" });
    }
  } catch (error) {
    console.log(error);
    if (error instanceof jwt.JsonWebTokenError) {
      if (error.message === "jwt expired") {
        return res
          .status(StatusCode.UNAUTHORIZED)
          .json({ error: "Token expired" });
      }
      if (error.message === "jwt malformed") {
        return res
          .status(StatusCode.UNAUTHORIZED)
          .json({ error: "Token malformed" });
      }
      if (error.message === "invalid signature") {
        return res
          .status(StatusCode.UNAUTHORIZED)
          .json({ error: "Invalid signature" });
      }
    }

    console.error("Unexpected error during token verification:", error);
    return res
      .status(StatusCode.INTERNAL_SERVER_ERROR)
      .json({ error: "An unexpected error occurred. Please try again later." });
  }
};
