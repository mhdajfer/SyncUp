import jwt from "jsonwebtoken";
import { IUser, IUserInvite } from "../interfaces/IUser";

const JWT_AUTHSECRET = process.env.JWT_AUTHSECRET || "secret-key";
const JWT_REFRESH_TOKEN = process.env.REFRESH_SECRET || "secret-key01";

export const createToken = (data: IUser | IUserInvite) => {
  console.log(`creating accessToken......\n`);
  return jwt.sign(data, JWT_AUTHSECRET, { expiresIn: "1h" });
};

export const createRefreshToken = (data: IUser | IUserInvite) => {
  console.log(`creating refreshToken......\n`);
  return jwt.sign(data, JWT_REFRESH_TOKEN, { expiresIn: "7d" });
};

export const verifyAccessToken = (token: string): IUser | IUserInvite => {
  try {
    const decoded = jwt.verify(token, JWT_AUTHSECRET);

    return decoded as IUser | IUserInvite;
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
