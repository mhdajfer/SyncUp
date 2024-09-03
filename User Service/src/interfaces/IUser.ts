import mongoose, { ObjectId } from "mongoose";

export interface IUser {
  _id?: mongoose.Types.ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  isBlocked?: boolean;
  age: number;
  phoneNumber: number;
  role?: string;
}