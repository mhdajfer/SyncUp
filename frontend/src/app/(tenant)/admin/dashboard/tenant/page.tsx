import TenantCard from "@/Components/Cards/TenantCard";
import { Button } from "@/Components/ui/button";

export default function page() {
  const dummyTenant = {
    tenant_id: "T20230915-001",
    register_date: new Date("2023-09-15T10:30:00Z"),
    company_name: "TechNova Solutions Inc.",
    company_type: "Corporation",
    address: {
      street: "789 Innovation Avenue",
      city: "Silicon Valley",
      state: "CA",
      zipCode: "94024",
      country: "United States",
    },
    phone_no: "+1 (650) 555-1234",
    domain: "https://www.technovasolutions.com",
    user_id: "U10092023-456",
    is_deleted: false,
  };
  return (
    <>
      <div>
        <div className="mb-3 flex pe-6">
            
          <Button
            className={`min-w-20 bg-violet-800 text-white hover:bg-violet-900 ms-auto`}
          >
            Create
          </Button>
        </div>
        <TenantCard tenant={dummyTenant} />
      </div>
    </>
  );
}
