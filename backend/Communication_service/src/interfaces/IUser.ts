import mongoose from "mongoose";

export interface IUser {
  _id: mongoose.Types.ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  isBlocked?: boolean;
  age: number;
  phoneNumber: number;
  isVerified?: boolean;
  isDeleted?: boolean;
  role?: string;
  iat?: number;
  exp?: number;
  __v?: number;
}
