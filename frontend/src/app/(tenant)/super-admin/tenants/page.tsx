"use client";
import { getAllTenants } from "@/api/tenantService/tenant";
import TenantTable from "@/Components/Tables/TenantTable";
import { ITenant } from "@/interfaces/User";
import { useEffect, useState } from "react";

export default function Page() {
  const [tenants, setTenants] = useState<ITenant[]>([]);

  const getData = async () => {
    try {
      const response = await getAllTenants();

      if (response.success) {
        setTenants(response.data);
      }
    } catch (error) {}
  };

  useEffect(() => {
    getData();
  }, []);
  return (
    <div className="w-full">
      <TenantTable tenants={tenants} />
    </div>
  );
}
