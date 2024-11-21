"use client";

import { useState } from "react";
import { Input } from "@/Components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/Components/ui/table";
import { Button } from "@/Components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ITenant } from "@/interfaces/User";
import TenantDetails from "../Cards/TenantDetails";

export default function TenantTable({ tenants }: { tenants: ITenant[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isTenantDetailsOpen, setIsTenantDetailsOpen] =
    useState<boolean>(false);
  const [selectedTenant, setSelectedTenant] = useState<ITenant | null>(null);
  const tenantsPerPage = 5;

  // Filter tenants based on search term
  const filteredTenants = tenants.filter((tenant) =>
    Object.values(tenant).some((value) =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Get current tenants
  const indexOfLastTenant = currentPage * tenantsPerPage;
  const indexOfFirstTenant = indexOfLastTenant - tenantsPerPage;
  const currentTenants = filteredTenants.slice(
    indexOfFirstTenant,
    indexOfLastTenant
  );

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div>
      {!isTenantDetailsOpen && (
        <div className=" bg-gray-900 text-gray-100 p-8">
          <div className="w-full">
            <h1 className="text-3xl font-bold mb-6">Tenant List</h1>
            <Input
              type="search"
              placeholder="Search tenants..."
              className="mb-4 bg-gray-800 text-gray-100 border-gray-700"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="border border-gray-700 rounded-md overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-gray-300">ID</TableHead>
                    <TableHead className="text-gray-300">
                      Company Name
                    </TableHead>
                    <TableHead className="text-gray-300">Website</TableHead>
                    <TableHead className="text-gray-300">Phone No.</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentTenants.map((tenant) => (
                    <TableRow
                      key={tenant.tenant_id}
                      className="hover:bg-gray-800"
                    >
                      <TableCell
                        className="hover:underline hover:text-blue-500 cursor-pointer"
                        onClick={() => {
                          setSelectedTenant(tenant);
                          setIsTenantDetailsOpen(true);
                        }}
                      >
                        {tenant.tenant_id}
                      </TableCell>
                      <TableCell>{tenant.company_name}</TableCell>
                      <TableCell>{tenant.domain}</TableCell>
                      <TableCell>{tenant.phone_no}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="flex justify-between items-center mt-4">
              <div className="text-sm text-gray-400">
                Showing {indexOfFirstTenant + 1} to{" "}
                {Math.min(indexOfLastTenant, filteredTenants.length)} of{" "}
                {filteredTenants.length} tenants
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="bg-gray-800 text-gray-100 border-gray-700 hover:bg-gray-700"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => paginate(currentPage + 1)}
                  disabled={indexOfLastTenant >= filteredTenants.length}
                  className="bg-gray-800 text-gray-100 border-gray-700 hover:bg-gray-700"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isTenantDetailsOpen && selectedTenant && (
        <TenantDetails
          tenant={selectedTenant}
          setClose={setIsTenantDetailsOpen}
        />
      )}
    </div>
  );
}
