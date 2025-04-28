import { Task } from "@/interfaces/Project";
import { User } from "@/interfaces/User";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";




export default function EmployeeEfficiency({
    tasks,
    developers,
  }: {
    tasks: Task[];
    developers: User[];
  }) {
    const calculateEmployeeMetrics = (developerId: string) => {
      const developerTasks = tasks.filter((task) =>
        typeof task.assignee === "object"
          ? task.assignee._id === developerId
          : task.assignee === developerId
      );
  
      const completedTasks = developerTasks.filter(
        (task) => task.status === "Completed"
      );
      const completionRate = developerTasks.length
        ? (completedTasks.length / developerTasks.length) * 100
        : 0;
  
      // Calculate total logged hours and expected hours
      const totalLoggedHours = completedTasks.reduce((total, task) => {
        return total + (task.log_time?.total_time || 0);
      }, 0);
  
      // Calculate expected hours based on task duration (days between start and due date)
      const totalExpectedHours = completedTasks.reduce((total, task) => {
        const startDate = new Date(task.start_date);
        const dueDate = new Date(task.due_date);
        const daysDiff = Math.ceil(
          (dueDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24)
        );
        // Assuming 8 working hours per day
        return total + daysDiff * 8;
      }, 0);
  
      // Calculate efficiency based on time management
      const efficiency =
        totalExpectedHours > 0
          ? Math.min(100, (totalExpectedHours / totalLoggedHours) * 100)
          : 0;
  
      return {
        totalTasks: developerTasks.length,
        completedTasks: completedTasks.length,
        completionRate,
        efficiency,
        totalLoggedHours,
        totalExpectedHours,
      };
    };
  
    return (
      <Card className="bg-gray-800 text-gray-100 col-span-2">
        <CardHeader>
          <CardTitle>Employee Efficiency</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {developers.map((developer) => {
              const metrics = calculateEmployeeMetrics(developer._id || "");
              return (
                <div
                  key={developer._id}
                  className="p-4 border border-gray-700 rounded-lg"
                >
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold">
                      {developer.firstName} {developer.lastName}
                    </h3>
                    <Badge
                      variant={metrics.efficiency > 75 ? "default" : "secondary"}
                    >
                      {metrics.efficiency.toFixed(1)}% Efficient
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Tasks Completed:</span>
                      <span>
                        {metrics.completedTasks} / {metrics.totalTasks}
                      </span>
                    </div>
                    <Progress value={metrics.completionRate} className="h-2" />
                    <div className="flex gap-2 mt-2">
                      <Badge variant="outline">
                        Completion Rate: {metrics.completionRate.toFixed(1)}%
                      </Badge>
                      <Badge variant="outline">
                        Hours: {metrics.totalLoggedHours.toFixed(1)} /{" "}
                        {metrics.totalExpectedHours.toFixed(1)}
                      </Badge>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    );
  }