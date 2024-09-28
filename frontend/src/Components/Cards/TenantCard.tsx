"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import {
  Building2,
  Calendar,
  Globe,
  Hash,
  MapPin,
  Phone,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";
import { getTenantDetails } from "@/api/tenantService/tenant";
import { ITenant, ITenantFrontend } from "@/interfaces/User";
import { Button } from "@/Components/ui/button";
import { AxiosError } from "axios";
import { toast } from "sonner";

export default function TenantCard() {
  const [tenant, setTenant] = useState<ITenantFrontend>({
    tenant_id: "",
    register_date: "",
    company_name: "",
    company_type: "",
    address: {
      country: "",
      postal_code: "",
      state: "",
      street: "",
    },
    phone_no: "",
    domain: "",
    user_id: "",
  });

  useEffect(() => {
    getTenant();
  }, []);

  async function getTenant() {
    try {
      const response = await getTenantDetails();
      const tenantData = response.data as ITenant;

      tenantData.register_date = new Date(
        tenantData.register_date
      ).toLocaleDateString();

      setTenant(tenantData);
    } catch (error: unknown) {
      if (error instanceof AxiosError && error.response) {
        return toast.message("Create a new tenant");
      }
      toast.error("something went wrong");
      console.log("Error retrieving tenant", error);
    }
  }

  return (
    <div>
      {!tenant.company_name && (
        <Button
          className={`min-w-20 bg-violet-800 text-white hover:bg-violet-900 ms-auto`}
        >
          <a href="tenant/create">Create</a>
        </Button>
      )}
      {tenant.company_name && (
        <Card className="w-full max-w-2xl mx-auto bg-gray-900 text-white">
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>{tenant?.company_name}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Hash className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-300">Tenant ID:</span>
                </div>
                <p className="font-medium">{tenant?.tenant_id}</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-300">Registered:</span>
                </div>
                <p className="font-medium">
                  {tenant?.register_date?.toString()}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Building2 className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-300">Company Type:</span>
              </div>
              <p className="font-medium">{tenant?.company_type}</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-300">Address:</span>
              </div>
              <p className="font-medium">
                {tenant?.address.street}, {tenant?.address.state}{" "}
                {tenant?.address.postal_code}, {tenant?.address.country}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-300">Phone:</span>
                </div>
                <p className="font-medium">{tenant?.phone_no}</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Globe className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-300">Domain:</span>
                </div>
                <p className="font-medium">{tenant?.domain || "N/A"}</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-300">User ID:</span>
              </div>
              <p className="font-medium">{tenant?.user_id}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
