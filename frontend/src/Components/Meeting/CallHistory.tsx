import { format } from "date-fns";
import {
  PhoneCall,
  PhoneIncoming,
  PhoneOutgoing,
  PhoneMissed,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/Components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import { Call } from "@/interfaces/Call";

export function CallHistory({ history }: { history: Call[] }) {
  const getStatusIcon = (type: string, status: string) => {
    if (status === "missed")
      return <PhoneMissed className="h-4 w-4 text-red-500" />;
    if (type === "incoming")
      return <PhoneIncoming className="h-4 w-4 text-green-500" />;
    return <PhoneOutgoing className="h-4 w-4 text-blue-500" />;
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      completed: "bg-green-500/10 text-green-500 hover:bg-green-500/20",
      missed: "bg-red-500/10 text-red-500 hover:bg-red-500/20",
      ongoing: "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20",
    };

    return (
      <Badge
        variant="outline"
        className={variants[status as keyof typeof variants]}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  // const formatDuration = (duration?: number) => {
  //   if (!duration) return "--";
  //   const minutes = Math.floor(duration / 60);
  //   const seconds = duration % 60;
  //   return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  // };

  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <PhoneCall className="h-5 w-5" />
          Call History
        </CardTitle>
        <CardDescription>Your recent call activities</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-gray-400">Type</TableHead>
              <TableHead className="text-gray-400">Receiver</TableHead>
              <TableHead className="text-gray-400">Time</TableHead>
              {/* <TableHead className="text-gray-400">Duration</TableHead> */}
              <TableHead className="text-gray-400">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {history.map((entry) => (
              <TableRow key={entry._id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(entry?.type, entry.status)}
                    <span className="capitalize text-gray-300">
                      {entry.type}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium text-gray-200">
                      {typeof entry.otherUserId == "object"
                        ? entry.otherUserId.firstName
                        : entry.otherUserId}
                    </span>
                    <span className="text-xs text-gray-400">
                      {typeof entry.otherUserId == "object"
                        ? entry.otherUserId.email
                        : entry.otherUserId}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="text-gray-300">
                      {entry.startTime &&
                        format(entry.startTime, "MMM dd, yyyy")}
                    </span>
                    <span className="text-xs text-gray-400">
                      {entry.startTime && format(entry.startTime, "hh:mm a")}
                    </span>
                  </div>
                </TableCell>
                {/* <TableCell className="text-gray-300">{"5555"}</TableCell> */}
                <TableCell>{getStatusBadge(entry.status)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
