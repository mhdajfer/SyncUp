import { Button } from "@/Components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/Components/ui/table";
import { User } from "@/interfaces/User";

export default function ManagerDevelopersTable({
  developerList,
}: {
  developerList: User[];
}) {
  return (
    <Table className="min-w-full table-auto border-collapse bg-white shadow-md rounded-lg">
      <TableCaption className="text-lg font-semibold text-gray-700 mb-4">
        Developer Details
      </TableCaption>
      <TableHeader className="bg-gray-100">
        <TableRow className="text-left text-sm font-semibold uppercase tracking-wide text-gray-700">
          <TableHead className="w-[60px] px-4 py-2 border-b border-gray-200">
            Serial No.
          </TableHead>
          <TableHead className="px-4 py-2 border-b border-gray-200">
            Name
          </TableHead>
          <TableHead className="px-4 py-2 border-b border-gray-200">
            Email
          </TableHead>
          <TableHead className="px-4 py-2 border-b border-gray-200">
            Phone No.
          </TableHead>
          <TableHead className="px-4 py-2 border-b border-gray-200 text-right">
            Actions
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {developerList?.map((developer, index) => (
          <TableRow
            key={index}
            className={`${
              index % 2 === 0 ? "bg-gray-50" : "bg-white"
            } hover:bg-gray-100 transition-colors duration-150`}
          >
            <TableCell className="px-4 py-2 font-medium text-gray-900 border-b border-gray-200">
              {index + 1}
            </TableCell>
            <TableCell className="px-4 py-2 font-medium text-gray-900 border-b border-gray-200">
              {developer?.firstName}
            </TableCell>
            <TableCell className="px-4 py-2 font-medium text-gray-900 border-b border-gray-200">
              {developer?.email}
            </TableCell>
            <TableCell className="px-4 py-2 font-medium text-gray-900 border-b border-gray-200">
              {developer?.phoneNumber}
            </TableCell>
            <TableCell className="px-4 py-2 font-medium text-gray-900 border-b border-gray-200 text-right">
              <div className="flex space-x-2 justify-end">
                <Button
                  variant="outline"
                  className="bg-blue-500 text-white hover:bg-blue-600"
                >
                  Edit
                </Button>
                <Button
                  variant="outline"
                  className="bg-green-500 text-white hover:bg-green-600"
                >
                  Update
                </Button>
                <Button
                  variant="outline"
                  className="bg-red-500 text-white hover:bg-red-600"
                >
                  Delete
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter className="bg-gray-100">
        <TableRow>
          <TableCell
            colSpan={4}
            className="px-4 py-2 font-semibold text-gray-700 border-b border-gray-200"
          >
            Total Developers
          </TableCell>
          <TableCell className="px-4 py-2 text-right text-gray-900 font-semibold border-b border-gray-200">
            {developerList.length}
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}
