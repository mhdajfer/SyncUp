import { Document, ObjectId } from "mongoose";

export interface IUser extends Document {
  _id: ObjectId;
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
