"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/Components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/Components/ui/table";
import { NoHistory } from "./NoHistory";
import { useEffect, useState } from "react";
import { Subscription } from "@/interfaces/Subscription";
import { AxiosError } from "axios";
import { toast } from "sonner";
import {
  getFullSubHistory,
  getSubscriptionHistory,
} from "@/api/userService/user";
import { format } from "date-fns";

export function SubscriptionHistory({
  role = "admin",
}: {
  role?: "admin" | "sAdmin";
}) {
  const [history, setHistory] = useState<Subscription[]>([]);

  useEffect(() => {
    async function getHistory() {
      try {
        const response = await (role == "admin"
          ? getSubscriptionHistory()
          : getFullSubHistory());

        if (response.success) {
          setHistory(response.data);
        }
      } catch (error: unknown) {
        if (error instanceof AxiosError && error.response) {
          toast.message("Create a new tenant");
        }
        toast.error("history not found");
        console.log("Error retrieving tenant", error);
      }
    }
    getHistory();
  }, [role]);

  if (history.length === 0) {
    return <NoHistory />;
  }
  return (
    <Card className="bg-gray-800 border-gray-700 w-full">
      <CardHeader>
        <CardTitle className="text-gray-100">Subscription History</CardTitle>
        <CardDescription className="text-gray-400">
          Your recent subscription activities
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="border-gray-700">
              <TableHead className="text-gray-300">Date</TableHead>
              <TableHead className="text-gray-300">Organisation ID</TableHead>
              <TableHead className="text-gray-300">Action</TableHead>
              <TableHead className="text-gray-300">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {history.map((item) => (
              <TableRow key={item._id} className="border-gray-700">
                <TableCell className="text-gray-300">
                  {format(item.date, "PPpp")}
                </TableCell>
                <TableCell className="text-gray-300">{item.orgName}</TableCell>
                <TableCell className="text-gray-300">{item.action}</TableCell>
                <TableCell className="text-gray-300">{item.amount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
