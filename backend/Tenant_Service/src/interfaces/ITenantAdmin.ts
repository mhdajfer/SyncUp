import { Document, ObjectId } from "mongoose";

export interface ITenantAdmin extends Document {
  id: ObjectId;
  firstName: string;
  lastName: string;
  phoneNumber: number;
  isDeleted: boolean;
  createdAt: Date;
  email: string;
  password: string;
}
