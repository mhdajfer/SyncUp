import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import {
  Building2,
  Calendar,
  Globe,
  Hash,
  MapPin,
  Phone,
  User,
} from "lucide-react";

interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface TenantDetails {
  tenant_id: string;
  register_date: Date;
  company_name: string;
  company_type: string;
  address: Address;
  phone_no: string;
  domain: string | null;
  user_id: string;
  is_deleted: boolean;
}

export default function TenantCard({ tenant }: { tenant: TenantDetails }) {
  return (
    <Card className="w-full max-w-2xl mx-auto bg-gray-900 text-white">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>{tenant.company_name}</span>
          {tenant.is_deleted && (
            <Badge variant="destructive" className="ml-2">
              Deleted
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Hash className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-300">Tenant ID:</span>
            </div>
            <p className="font-medium">{tenant.tenant_id}</p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-300">Registered:</span>
            </div>
            <p className="font-medium">
              {tenant.register_date.toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Building2 className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-300">Company Type:</span>
          </div>
          <p className="font-medium">{tenant.company_type}</p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <MapPin className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-300">Address:</span>
          </div>
          <p className="font-medium">
            {tenant.address.street}, {tenant.address.city},{" "}
            {tenant.address.state} {tenant.address.zipCode},{" "}
            {tenant.address.country}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Phone className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-300">Phone:</span>
            </div>
            <p className="font-medium">{tenant.phone_no}</p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Globe className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-300">Domain:</span>
            </div>
            <p className="font-medium">{tenant.domain || "N/A"}</p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <User className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-300">User ID:</span>
          </div>
          <p className="font-medium">{tenant.user_id}</p>
        </div>
      </CardContent>
    </Card>
  );
}
