import { ObjectId } from "mongoose";

export interface IAddress {
  building_no: string;
  city: string;
  country: string;
  postal_code: string;
  state: string;
  street: string;
}

export interface ITenants {
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
