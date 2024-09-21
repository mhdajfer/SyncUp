import jwt from "jsonwebtoken";
import { IUser } from "../interfaces/IUser";

const JWT_AUTHSECRET = process.env.JWT_AUTHSECRET || "secret-key";
const JWT_REFRESH_TOKEN = process.env.REFRESH_SECRET || "secret-key01";

export const createToken = (data: IUser) => {
  console.log(`creating accessToken......\n`);
  return jwt.sign(data, JWT_AUTHSECRET, { expiresIn: "20s" });
};

export const createRefreshToken = (data: IUser) => {
  console.log(`creating refreshToken......\n`);
  return jwt.sign(data, JWT_REFRESH_TOKEN, { expiresIn: "7d" });
};

export const verifyAccessToken = (token: string): IUser => {
  try {
    const decoded = jwt.verify(token, JWT_AUTHSECRET);

    return decoded as IUser;
  } catch (err) {
    throw new Error(`Error verifying token: ${JSON.stringify(err)}`);
  }
};

export const verifyRefreshToken = (token: string): IUser => {
  try {
    console.log(`verifying refreshToken......\n`);
    const decoded = jwt.verify(token, JWT_REFRESH_TOKEN);
    return decoded as IUser;
  } catch (error) {
    throw error;
  }
};
