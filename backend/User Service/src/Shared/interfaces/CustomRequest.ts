import { Request } from "express";
import { IUser } from "./IUser";

export interface CustomRequest extends Request {
  user?: IUser;
}
