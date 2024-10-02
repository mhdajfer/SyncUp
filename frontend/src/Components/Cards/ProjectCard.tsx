import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import { CalendarIcon, DollarSignIcon } from "lucide-react";
import { Project } from "@/interfaces/Project";
import { useRouter } from "next/navigation";

export default function ProjectCard({ project }: { project: Project }) {
  const router = useRouter();
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "in progress":
        return "bg-blue-600";
      case "completed":
        return "bg-green-600";
      case "on hold":
        return "bg-yellow-600";
      default:
        return "bg-gray-600";
    }
  };

  return (
    <Card className="w-[23vw] max-w-md bg-gray-900 text-gray-100 shadow-xl m-3 border relative border-slate-600 ">
      <CardHeader className="border-b border-gray-800">
        <CardTitle className="flex items-center justify-between">
          <span
            className="text-xl font-bold text-gray-300 hover:text-white cursor-pointer hover:underline"
            onClick={() => router.push(`projects/${project._id}`)}
          >
            {project.name}
          </span>
          <Badge className={`${getStatusColor(project.status)} text-white`}>
            {project.status}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="mt-4 text-gray-500">
        <p className="text-sm  mb-4">{project.description}</p>
        <div className="flex items-center text-sm  mb-2">
          <CalendarIcon className="w-4 h-4 mr-2" />
          <span>
            {formatDate(project.start_date)} - {formatDate(project.due_date)}
          </span>
        </div>
        <div className="flex items-center text-sm ">
          <DollarSignIcon className="w-4 h-4 mr-2" />
          <span>Budget: ${project.budget.toLocaleString()}</span>
        </div>
      </CardContent>
      <CardFooter className="bg-gray-800 text-sm text-gray-700 rounded-b-xl pt-1">
        <span>Project ID: {project._id}</span>
      </CardFooter>
    </Card>
  );
}
