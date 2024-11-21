import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Label } from "@/Components/ui/label";
import { ITenant } from "@/interfaces/User";
import { X } from "lucide-react";

export default function TenantDetails({
  tenant,
  setClose,
}: {
  tenant: ITenant;
  setClose: (val: boolean) => void;
}) {
  if (!tenant) {
    return <div className="text-center text-gray-300">Loading...</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className=" flex items-center justify-center"
    >
      <Card className="w-full max-w-2xl bg-gray-800 text-gray-100 border-gray-700">
        <CardHeader className="relative">
          <CardTitle className="text-2xl font-bold text-center">
            {tenant.company_name}
          </CardTitle>
          <X
            className="h-4 w-4 absolute top-1 right-1 text-gray-200 hover:text-white cursor-pointer hover:font-xl"
            onClick={() => setClose(false)}
          />
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-gray-400">
                Tenant ID
              </Label>
              <div className="text-lg">{tenant.tenant_id}</div>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-400">
                Registration Date
              </Label>
              <div className="text-lg">
                {new Date(tenant.register_date).toLocaleDateString()}
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-400">
                Company Type
              </Label>
              <div className="text-lg">{tenant.company_type}</div>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-400">
                Phone Number
              </Label>
              <div className="text-lg">{tenant.phone_no}</div>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-400">
                Domain
              </Label>
              <div className="text-lg">{tenant.domain || "N/A"}</div>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-400">
                User ID
              </Label>
              <div className="text-lg">{tenant.user_id}</div>
            </div>
          </div>
          <div>
            <Label className="text-sm font-medium text-gray-400">Address</Label>
            <div className="text-lg">
              {tenant.address.street}, {tenant.address.state},{" "}
              {tenant.address.postal_code}, {tenant.address.country}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
