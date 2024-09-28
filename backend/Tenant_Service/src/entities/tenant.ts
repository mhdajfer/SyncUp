import { Schema } from "mongoose";
import { ITenants } from "../interfaces/ITenant";

const AddressSchema: Schema = new Schema({
  country: { type: String, required: true },
  postal_code: { type: String, required: true },
  state: { type: String, required: true },
  street: { type: String, required: true },
});

const TenantSchema: Schema = new Schema({
  tenant_id: { type: String, required: true },
  register_date: { type: Date, default: Date.now },
  company_name: { type: String, required: true, unique: true },
  company_type: { type: String, required: true },
  address: { type: AddressSchema, required: true },
  phone_no: { type: String, required: true },
  domain: { type: String, default: null },
  user_id: { type: Schema.Types.ObjectId, required: true },
  is_deleted: { type: Boolean, default: false },
});

export default TenantSchema;
