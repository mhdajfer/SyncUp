import mongoose from "mongoose";
import { ITenants } from "../../Shared/interfaces/ITenant";
import TenantSchema from "../entities/tenant";

const Tenant = mongoose.model<ITenants & Document>("Tenant", TenantSchema);

export default Tenant;
