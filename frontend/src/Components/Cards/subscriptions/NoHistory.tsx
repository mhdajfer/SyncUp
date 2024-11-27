import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/Components/ui/card";
import { ClipboardX } from "lucide-react";

export function NoHistory() {
  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-gray-100">Subscription History</CardTitle>
        <CardDescription className="text-gray-400">
          Your recent subscription activities
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center py-10">
        <ClipboardX className="w-16 h-16 text-gray-500 mb-4" />
        <h3 className="text-xl font-semibold text-gray-300 mb-2">
          No History Found
        </h3>
        <p className="text-gray-400 text-center max-w-sm">
          {`You don't have any subscription history yet. Your future subscription
          activities will appear here.`}
        </p>
      </CardContent>
    </Card>
  );
}
