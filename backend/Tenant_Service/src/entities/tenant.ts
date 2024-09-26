import { Schema } from "mongoose";

const AddressSchema: Schema = new Schema({
  building_no: { type: String, required: true },
  city: { type: String, required: true },
  country: { type: String, required: true },
  postal_code: { type: String, required: true },
  state: { type: String, required: true },
  street: { type: String, required: true },
});

const TenantsSchema: Schema = new Schema({
  tenant_id: { type: String, required: true, unique: true },
  register_date: { type: Date, required: true, default: Date.now },
  company_name: { type: String, required: true, unique: true },
  company_type: { type: String, required: true },
  address: { type: AddressSchema, required: true },
  phone_no: { type: String, required: true },
  domain: { type: String, default: null },
  user_id: { type: Schema.Types.ObjectId, required: true, unique: true },
  is_deleted: { type: Boolean, default: false },
});

export default TenantsSchema;
