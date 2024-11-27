import { Document, ObjectId } from "mongoose";

export interface IUser extends Document {
  _id: ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  subscriptionStatus: boolean;
  subscriptionAmount?: number;
  isBlocked?: boolean;
  age: number;
  tenant_id: string;
  phoneNumber: number;
  isVerified?: boolean;
  isDeleted?: boolean;
  role?: string;
  iat?: number;
  exp?: number;
  __v?: number;
}
