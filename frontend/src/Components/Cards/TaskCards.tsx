import { Task } from "@/interfaces/Project";
import { format } from "date-fns";
import { CalendarDays, User } from "lucide-react";
import { useRouter } from "next/navigation";

export default function TaskCards({ task }: { task: Task }) {
  const router = useRouter();
  return (
    <>
      {task && (
        <div className="bg-gray-900 p-4 rounded-md shadow w-full h-full">
          <h3
            className="text-lg font-semibold text-gray-100 mb-2 hover:underline cursor-pointer hover:text-gray-200"
            onClick={() => router.push(`${task._id}`)}
          >
            {task.title}
          </h3>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center text-gray-300">
              <CalendarDays className="w-4 h-4 mr-2" />
              <span>{format(new Date(task.due_date), "MMMM dd, yyyy")}</span>
            </div>
            <div className="flex items-center text-gray-300">
              <User className="w-4 h-4 mr-2" />
              {typeof task.assignee === "string" ? (
                <span>{task.assignee}</span>
              ) : (
                <span>
                  {task.assignee.firstName} {task.assignee.lastName}
                </span>
              )}
            </div>
          </div>
          
        </div>
      )}
    </>
  );
}
