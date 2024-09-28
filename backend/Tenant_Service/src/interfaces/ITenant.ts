import { Document, ObjectId } from "mongoose";

export interface IAddress {
  country: string;
  postal_code: string;
  state: string;
  street: string;
}

export interface ICreateTenant {
  company_name: string;
  company_type: string;
  address: {
    country: string;
    postal_code: string;
    state: string;
    street: string;
  };
  phone_no: string;
  domain?: string;
}

export interface ITenants extends Document {
  _id: ObjectId;
  tenant_id: string;
  register_date: Date;
  company_name: string;
  company_type: string;
  address: IAddress;
  phone_no: string;
  domain: string | null;
  user_id: ObjectId;
}
