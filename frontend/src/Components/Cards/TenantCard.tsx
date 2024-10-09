// "use client";

// import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
// import {
//   Building2,
//   Calendar,
//   Globe,
//   Hash,
//   MapPin,
//   Phone,
//   User,
// } from "lucide-react";
// import { useEffect, useState } from "react";
// import { getTenantDetails } from "@/api/tenantService/tenant";
// import { ITenant, ITenantFrontend } from "@/interfaces/User";
// import { Button } from "@/Components/ui/button";
// import { AxiosError } from "axios";
// import { toast } from "sonner";

// export default function TenantCard() {
//   const [tenant, setTenant] = useState<ITenantFrontend>({
//     tenant_id: "",
//     register_date: "",
//     company_name: "",
//     company_type: "",
//     address: {
//       country: "",
//       postal_code: "",
//       state: "",
//       street: "",
//     },
//     phone_no: "",
//     domain: "",
//     user_id: "",
//   });

//   useEffect(() => {
//     getTenant();
//   }, []);

//   async function getTenant() {
//     try {
//       const response = await getTenantDetails();
//       const tenantData = response.data as ITenant;

//       tenantData.register_date = new Date(
//         tenantData.register_date
//       ).toLocaleDateString();

//       setTenant(tenantData);
//     } catch (error: unknown) {
//       if (error instanceof AxiosError && error.response) {
//         return toast.message("Create a new tenant");
//       }
//       toast.error("something went wrong");
//       console.log("Error retrieving tenant", error);
//     }
//   }

//   return (
//     <div>
//       {!tenant.company_name && (
//         <Button
//           className={`min-w-20 bg-violet-800 text-white hover:bg-violet-900 ms-auto`}
//         >
//           <a href="tenant/create">Create</a>
//         </Button>
//       )}
//       {tenant.company_name && (
//         <Card className="w-full max-w-2xl mx-auto bg-gray-900 text-white">
//           <CardHeader>
//             <CardTitle className="flex justify-between items-center">
//               <span>{tenant?.company_name}</span>
//             </CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             <div className="grid grid-cols-2 gap-4">
//               <div className="space-y-2">
//                 <div className="flex items-center space-x-2">
//                   <Hash className="w-4 h-4 text-gray-400" />
//                   <span className="text-sm text-gray-300">Tenant ID:</span>
//                 </div>
//                 <p className="font-medium">{tenant?.tenant_id}</p>
//               </div>
//               <div className="space-y-2">
//                 <div className="flex items-center space-x-2">
//                   <Calendar className="w-4 h-4 text-gray-400" />
//                   <span className="text-sm text-gray-300">Registered:</span>
//                 </div>
//                 <p className="font-medium">
//                   {tenant?.register_date?.toString()}
//                 </p>
//               </div>
//             </div>

//             <div className="space-y-2">
//               <div className="flex items-center space-x-2">
//                 <Building2 className="w-4 h-4 text-gray-400" />
//                 <span className="text-sm text-gray-300">Company Type:</span>
//               </div>
//               <p className="font-medium">{tenant?.company_type}</p>
//             </div>

//             <div className="space-y-2">
//               <div className="flex items-center space-x-2">
//                 <MapPin className="w-4 h-4 text-gray-400" />
//                 <span className="text-sm text-gray-300">Address:</span>
//               </div>
//               <p className="font-medium">
//                 {tenant?.address.street}, {tenant?.address.state}{" "}
//                 {tenant?.address.postal_code}, {tenant?.address.country}
//               </p>
//             </div>

//             <div className="grid grid-cols-2 gap-4">
//               <div className="space-y-2">
//                 <div className="flex items-center space-x-2">
//                   <Phone className="w-4 h-4 text-gray-400" />
//                   <span className="text-sm text-gray-300">Phone:</span>
//                 </div>
//                 <p className="font-medium">{tenant?.phone_no}</p>
//               </div>
//               <div className="space-y-2">
//                 <div className="flex items-center space-x-2">
//                   <Globe className="w-4 h-4 text-gray-400" />
//                   <span className="text-sm text-gray-300">Domain:</span>
//                 </div>
//                 <p className="font-medium">{tenant?.domain || "N/A"}</p>
//               </div>
//             </div>

//             <div className="space-y-2">
//               <div className="flex items-center space-x-2">
//                 <User className="w-4 h-4 text-gray-400" />
//                 <span className="text-sm text-gray-300">User ID:</span>
//               </div>
//               <p className="font-medium">{tenant?.user_id}</p>
//             </div>
//           </CardContent>
//         </Card>
//       )}
//     </div>
//   );
// }

"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import {
  Building2,
  Calendar,
  Globe,
  Hash,
  MapPin,
  Phone,
  User,
  Edit2,
  Save,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import React from "react";
import {
  editTenantDetails,
  getTenantDetails,
} from "@/api/tenantService/tenant";
import { ITenant, ITenantFrontend } from "@/interfaces/User";
import { AxiosError } from "axios";

// interface ITenantFrontend {
//   tenant_id: string;
//   register_date: string;
//   company_name: string;
//   company_type: string;
//   address: {
//     country: string;
//     postal_code: string;
//     state: string;
//     street: string;
//   };
//   phone_no: string;
//   domain: string;
//   user_id: string;
// }

// Dummy data for testing
// const dummyTenant: ITenantFrontend = {
//   tenant_id: "T12345",
//   register_date: "2023-01-15",
//   company_name: "Acme Corporation",
//   company_type: "Technology",
//   address: {
//     country: "United States",
//     postal_code: "90210",
//     state: "California",
//     street: "123 Tech Boulevard",
//   },
//   phone_no: "+1 (555) 123-4567",
//   domain: "acmecorp.com",
//   user_id: "U98765",
// }

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
  const [isEditing, setIsEditing] = useState(false);
  const [editedTenant, setEditedTenant] = useState<ITenantFrontend>({
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
      setEditedTenant(tenantData);
    } catch (error: unknown) {
      if (error instanceof AxiosError && error.response) {
        return toast.message("Create a new tenant");
      }
      toast.error("something went wrong");
      console.log("Error retrieving tenant", error);
    }
  }

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      const response = await editTenantDetails(editedTenant as ITenant);

      if (response.success) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setTenant(editedTenant);
        setIsEditing(false);
        toast.success("Tenant details updated successfully");
      } else {
        toast.error("tenant details not updated!!!");
      }
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message);
      } else toast.error("Failed to update tenant details");
      console.log("Error updating tenant", error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedTenant((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedTenant((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        [name]: value,
      },
    }));
  };

  return (
    // <div className="">
    <Card className=" w-full rounded-xl overflow-hidden pb-28 bg-gray-900 text-white border border-gray-800">
      <CardHeader className="bg-gray-700 p-6">
        <CardTitle className="w-full flex justify-between items-center text-2xl font-bold">
          <span>{isEditing ? "Edit Tenant Details" : tenant.company_name}</span>

          {!isEditing && (
            <Button
              onClick={handleEdit}
              className="bg-violet-600 hover:bg-violet-700"
            >
              <Edit2 className="w-4 h-4 mr-2" />
              Edit
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 pt-16 space-y-6">
        {isEditing ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSave();
            }}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="company_name">Company Name</Label>
                <Input
                  id="company_name"
                  name="company_name"
                  value={editedTenant.company_name}
                  onChange={handleInputChange}
                  className="bg-gray-700 text-white"
                />
              </div>
              <div>
                <Label htmlFor="company_type">Company Type</Label>
                <Input
                  id="company_type"
                  name="company_type"
                  value={editedTenant.company_type}
                  onChange={handleInputChange}
                  className="bg-gray-700 text-white"
                />
              </div>
              <div>
                <Label htmlFor="phone_no">Phone Number</Label>
                <Input
                  id="phone_no"
                  name="phone_no"
                  value={editedTenant.phone_no}
                  onChange={handleInputChange}
                  className="bg-gray-700 text-white"
                />
              </div>
              <div>
                <Label htmlFor="domain">Domain</Label>
                <Input
                  id="domain"
                  name="domain"
                  value={editedTenant.domain}
                  onChange={handleInputChange}
                  className="bg-gray-700 text-white"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="street">Street</Label>
              <Input
                id="street"
                name="street"
                value={editedTenant.address.street}
                onChange={handleAddressChange}
                className="bg-gray-700 text-white"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  name="state"
                  value={editedTenant.address.state}
                  onChange={handleAddressChange}
                  className="bg-gray-700 text-white"
                />
              </div>
              <div>
                <Label htmlFor="postal_code">Postal Code</Label>
                <Input
                  id="postal_code"
                  name="postal_code"
                  value={editedTenant.address.postal_code}
                  onChange={handleAddressChange}
                  className="bg-gray-700 text-white"
                />
              </div>
              <div>
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  name="country"
                  value={editedTenant.address.country}
                  onChange={handleAddressChange}
                  className="bg-gray-700 text-white"
                />
              </div>
            </div>
            <Button
              type="submit"
              className="w-full bg-violet-600 hover:bg-violet-700"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </form>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InfoItem
                icon={<Hash />}
                label="Tenant ID"
                value={tenant.tenant_id}
              />
              <InfoItem
                icon={<Calendar />}
                label="Registered"
                value={new Date(tenant.register_date).toLocaleDateString()}
              />
              <InfoItem
                icon={<Building2 />}
                label="Company Type"
                value={tenant.company_type}
              />
              <InfoItem
                icon={<Phone />}
                label="Phone"
                value={tenant.phone_no}
              />
              <InfoItem
                icon={<Globe />}
                label="Domain"
                value={tenant.domain || "N/A"}
              />
              <InfoItem
                icon={<User />}
                label="User ID"
                value={tenant.user_id}
              />
            </div>
            <InfoItem
              icon={<MapPin />}
              label="Address"
              value={`${tenant.address.street}, ${tenant.address.state} ${tenant.address.postal_code}, ${tenant.address.country}`}
            />
          </>
        )}
      </CardContent>
    </Card>
    // </div>
  );
}

function InfoItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start space-x-3">
      <div className="flex-shrink-0 mt-1">
        {React.cloneElement(icon as React.ReactElement, {
          className: "w-5 h-5 text-violet-400",
        })}
      </div>
      <div>
        <p className="text-sm font-medium text-gray-400">{label}</p>
        <p className="mt-1 text-lg font-semibold">{value}</p>
      </div>
    </div>
  );
}
