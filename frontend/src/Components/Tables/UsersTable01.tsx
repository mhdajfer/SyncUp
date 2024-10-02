import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/Components/ui/table";
import { GrFormNextLink, GrFormPreviousLink } from "react-icons/gr";
import { User } from "@/interfaces/User";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { blockUser } from "@/api/userService/user";
import { AxiosError } from "axios";
import NoData from "../NoData/NoData";

export function UsersTable01({ usersList }: { usersList: User[] }) {
  const [page, setPage] = useState(1);
  const rowsPerPage = 3;
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    setUsers(usersList);
  }, [usersList]);

  const totalPages = Math.ceil(users.length / rowsPerPage);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const paginatedUsers = users.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  const handleBlock = async (userId: undefined | string) => {
    try {
      if (!userId) return toast.error("Invalid User ID");

      const response = await blockUser(userId);
      if (response.success) {
        toast.success(response.message);

        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user._id === userId ? { ...user, isBlocked: !user.isBlocked } : user
          )
        );
      } else {
        toast.error("Failed to block/unblock the user.");
      }
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.error);
      } else toast.error("Error occurred while blocking/unblocking user.");
    }
  };

  return (
    <div>
      {users.length > 0 ? (
        <div className="min-w-full bg-slate-900 rounded-lg p-4 border border-slate-600">
          <Table className="text-white rounded-lg text-center ">
            <TableHeader>
              <TableRow className="  hover:bg-slate-900 ">
                <TableHead className="text-center">sl no.</TableHead>
                <TableHead className="text-center">Name</TableHead>
                <TableHead className="text-center">Email</TableHead>
                <TableHead className="text-center">Phone no.</TableHead>
                <TableHead className="text-center">Designation</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedUsers.map((user, index) => (
                <TableRow
                  key={index}
                  className=" border-none hover:bg-slate-800 cursor-text"
                >
                  <TableCell className="font-small ">
                    {(page - 1) * rowsPerPage + index + 1}
                  </TableCell>
                  <TableCell>{user.firstName}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell
                    className={`${
                      user.status ? "text-yellow-600 " : "text-lime-200"
                    } text-xs font-sans`}
                  >
                    {user.status ? user.status : "Active"}
                  </TableCell>
                  <TableCell className="">
                    <div className="flex space-x-2 justify-center">
                      <Button
                        className={`min-w-20 ${
                          user.isBlocked ? "bg-green-700" : "bg-green-800"
                        } text-white hover:bg-green-600`}
                        onClick={() => handleBlock(user._id)}
                      >
                        {user.isBlocked ? "Unblock" : "Block"}
                      </Button>
                      <Button className="bg-red-500 text-white hover:bg-red-900">
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="flex justify-between mt-4 items-center">
            <Button
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
              className=" text-white bg-slate-900 hover:bg-slate-800"
            >
              <GrFormPreviousLink size={20} />
            </Button>

            <span className="text-gray-600 text-xs ms-auto me-4">
              Page {page} of {totalPages}
            </span>

            <Button
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages}
              className=" text-white bg-slate-900 hover:bg-slate-800"
            >
              <GrFormNextLink size={20} />
            </Button>
          </div>
        </div>
      ) : (
        <NoData />
      )}
    </div>
  );
}
