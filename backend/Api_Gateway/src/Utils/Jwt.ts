import jwt from "jsonwebtoken";
import { IUser } from "../Interfaces/IUser";

const JWT_AUTHSECRET = process.env.JWT_AUTHSECRET || "secret-key";
const JWT_REFRESH_TOKEN = process.env.JWT_REFRESH_SECRET || "secret-key01";

export const createToken = (data: IUser) => {
  console.log(`creating accessToken......\n`);
  return jwt.sign(data, JWT_AUTHSECRET, { expiresIn: "10m" });
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

export const verifyRefreshToken = (token: string) => {
  console.log(`verifying refreshToken......\n`);
  return jwt.verify(token, JWT_REFRESH_TOKEN, (err, decoded) => {
    if (err) {
      return false;
    }
    console.log("decoded", decoded);
    return decoded;
  });
};
