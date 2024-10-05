import { Document, ObjectId } from "mongoose";

export interface IUser {
  _id?: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  isBlocked?: boolean;
  age: number;
  phoneNumber: number;
  isVerified?: boolean;
  isDeleted?: boolean;
  tenant_id: string;
  role?: string;
  iat?: number;
  exp?: number;
  __v?: number;
}

export interface IUserInvite {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  phoneNumber: number;
  tenant_id?: string;
}
