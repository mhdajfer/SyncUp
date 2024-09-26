import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { Document } from "mongoose";

const userRepository: IUserRepository = new UserRepository();
export default async (
  req: Request & Partial<{ user: Partial<decodedUser> }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.header("Authorization");

    if (token) {
      if (!process.env.JWT_SECRET_KEY)
        throw new Error("JWT_SECRET_KEY not found in .env file");

      const decode = jwt.verify(
        token,
        process.env.JWT_SECRET_KEY
      ) as JwtPayload;

      console.log(decode);

      if (decode) {
        const userObj = await userRepository.fetchUser(decode.email);
        if (!userObj) {
          return res.status(401).json({ error: "unauthorised" });
        }
        if (userObj.is_blocked)
          return res.status(401).json({ error: "user is blocked" });
        if (userObj.is_deleted)
          return res.status(401).json({ error: "user is deleted" });
        if (!userObj.is_verified)
          return res.status(401).json({ error: "user is not verified" });

        req.user = userObj;
        req.user.decode = decode;

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
