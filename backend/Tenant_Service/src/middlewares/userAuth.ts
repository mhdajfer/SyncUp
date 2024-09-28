import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { Document } from "mongoose";
import { IUser } from "../interfaces/IUser";

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
            .status(403)
            .json({ success: false, message: "user is blocked" });
        if (decode.isDeleted)
          return res
            .status(403)
            .json({ success: false, message: "user is deleted" });
        if (!decode.isVerified)
          return res
            .status(403)
            .json({ success: false, message: "user is not verified" });

        req.user = decode;

        next();
      } else {
        res.status(401).json({ error: "unauthorised" });
      }
    } else {
      res.status(401).json({ error: "unauthorised" });
    }
  } catch (error: any) {
    console.log(error);
    if (
      error.message === "jwt expired" ||
      error.message === "jwt malformed" ||
      error.message === "invalid signature"
    )
      return res.status(401).json({ error: "Token expired or Invalid" });

    res
      .status(500)
      .json({ error: "An unexpected error occurred. Please try again later." });
  }
};
