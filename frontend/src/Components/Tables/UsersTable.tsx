import { blockUser } from "@/api/userService/user";
import { Button } from "@/Components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/Components/ui/table";
import { User } from "@/interfaces/User";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function UsersTable({ usersList }: { usersList: User[] }) {
  const [users, setUsers] = useState<User[]>([]);
  async function handleBlock(userId: string | undefined) {
    try {
      if (!userId) return toast.error("Invalid User ID");
      console.log(userId);

      const response = await blockUser(userId);

      if (response.success) {
        toast.success(response.message);
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user._id === userId ? { ...user, isBlocked: !user.isBlocked } : user
          )
        );
      }
    } catch (error) {
      toast.error("Error occured");
      console.log("error while blocking user", error);
    }
  }
  console.log(users);

  useEffect(() => {
    setUsers(usersList);
  }, [usersList]);
  return (
    <Table className="min-w-full table-auto border-collapse bg-white shadow-md rounded-lg text-center">
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
        {users?.map((developer, index) => (
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
                  className={`min-w-24 ${
                    developer.isBlocked ? "bg-green-800" : "bg-green-500"
                  } text-white hover:bg-green-600`}
                  onClick={() => handleBlock(developer._id)}
                >
                  {developer.isBlocked ? "UnBlock" : "Block"}
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
            Total Employees
          </TableCell>
          <TableCell className="px-4 py-2 text-right text-gray-900 font-semibold border-b border-gray-200">
            {users.length}
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}
