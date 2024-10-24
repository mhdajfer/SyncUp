import { Document } from "mongoose";

export interface User {
  _id?: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  isBlocked?: boolean;
  age: number;
  phoneNumber?: number;
  role?: string;
  confirmPassword?: string;
  status?: string;
  tenant_id?: string;
  avatar?: string;
}

export interface IAddress {
  country: string;
  postal_code: string;
  state: string;
  street: string;
}

export interface ITenantFrontend {
  tenant_id: string;
  register_date: string | Date;
  company_name: string;
  company_type: string;
  address: IAddress;
  phone_no: string;
  domain?: string;
  user_id: string;
}

export interface ITenant extends Document {
  tenant_id: string;
  register_date: string | Date;
  company_name: string;
  company_type: string;
  address: IAddress;
  phone_no: string;
  domain?: string;
  user_id: string;
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
