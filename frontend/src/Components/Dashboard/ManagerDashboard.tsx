"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Progress } from "@/Components/ui/progress";
import { Badge } from "@/Components/ui/badge";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { Project, Task } from "@/interfaces/Project";
import { Button } from "../ui/button";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28"];

export default function ManagerDashboard({
  projects,
  tasks,
}: {
  tasks: Task[];
  projects: Project[];
}) {
  const exportToExcel = async () => {
    const workbook = new ExcelJS.Workbook();

    // Create "Tasks" sheet
    const taskSheet = workbook.addWorksheet("Tasks");
    taskSheet.columns = [
      { header: "Task ID", key: "_id", width: 15 },
      { header: "Title", key: "title", width: 20 },
      { header: "Project ID", key: "projectId", width: 15 },
      { header: "Status", key: "status", width: 15 },
      { header: "Category", key: "category", width: 15 },
      { header: "Start Date", key: "start_date", width: 15 },
      { header: "Due Date", key: "due_date", width: 15 },
      { header: "Assignee", key: "assignee", width: 20 },
      { header: "Total Logged Hours", key: "total_time", width: 20 },
    ];

    // Add tasks data
    taskSheet.addRows(
      tasks.map((task) => ({
        ...task,
        total_time: task.log_time?.total_time || 0,
      }))
    );

    // Create "Projects" sheet
    const projectSheet = workbook.addWorksheet("Projects");
    projectSheet.columns = [
      { header: "Project ID", key: "_id", width: 15 },
      { header: "Name", key: "name", width: 20 },
      { header: "Description", key: "description", width: 30 },
      { header: "Manager ID", key: "managerId", width: 20 },
      { header: "Start Date", key: "start_date", width: 15 },
      { header: "Due Date", key: "due_date", width: 15 },
      { header: "Status", key: "status", width: 15 },
      { header: "Budget", key: "budget", width: 15 },
      { header: "Goal", key: "goal", width: 30 },
    ];

    // Add projects data
    projectSheet.addRows(projects);

    // Generate file and trigger download
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, "tasks_and_projects.xlsx");
  };
  return (
    <div className="relative container mx-auto p-4 bg-gray-900 text-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Manager Dashboard</h1>
      <div className="absolute right-10 flex space-x-4 mt-4">
        <Button
          onClick={exportToExcel}
          className="bg-violet-800 hover:bg-violet-900 cursor-pointer  text-neutral-200 hover:text-white"
        >
          Download as Excel
        </Button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-28">
        <ProjectOverview projects={projects} />
        <TaskProgress tasks={tasks} />
      </div>
    </div>
  );
}

function ProjectOverview({ projects }: { projects: Project[] }) {
  const statusCounts = projects.reduce((acc, project) => {
    acc[project.status] = (acc[project.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const data = Object.entries(statusCounts).map(([status, count]) => ({
    name: status,
    value: count,
  }));

  return (
    <Card className="bg-gray-800 text-gray-100">
      <CardHeader>
        <CardTitle>Project Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64 relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <p className="text-3xl font-bold">{projects.length}</p>
              <p className="text-sm">Total Projects</p>
            </div>
          </div>
        </div>
        <div className="mt-4 flex justify-center space-x-4">
          {Object.entries(statusCounts).map(([status, count], index) => (
            <div key={status} className="flex items-center">
              <div
                className="w-3 h-3 rounded-full mr-2"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              ></div>
              <span>
                {status}: {count}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function TaskProgress({ tasks }: { tasks: Task[] }) {
  const tasksByCategory = tasks.reduce((acc, task) => {
    acc[task.category] = (acc[task.category] || []).concat(task);
    return acc;
  }, {} as Record<string, Task[]>);

  const calculateProgress = (categoryTasks: Task[]) => {
    const completed = categoryTasks.filter(
      (task) => task.status === "Completed"
    ).length;
    return Math.round((completed / categoryTasks.length) * 100);
  };

  console.log("progress task", tasks);

  return (
    <Card className="bg-gray-800 text-gray-100">
      <CardHeader>
        <CardTitle>Task Progress</CardTitle>
      </CardHeader>
      <CardContent>
        {Object.entries(tasksByCategory).map(([category, categoryTasks]) => (
          <div key={category} className="mb-4">
            <h3 className="text-sm font-semibold mb-2">{category}</h3>
            <div className="flex justify-between mb-1">
              <span className="text-sm text-gray-400">
                {categoryTasks.length} tasks
              </span>
              <span className="text-sm text-gray-400">
                {calculateProgress(categoryTasks)}% Complete
              </span>
            </div>
            <Progress
              value={calculateProgress(categoryTasks)}
              className="h-2 mb-2"
            />
            <div className="flex gap-2">
              {["To Do", "In Progress", "Completed"].map((status) => (
                <Badge
                  key={status}
                  variant={status === "Completed" ? "default" : "secondary"}
                  className="bg-gray-700 text-gray-200"
                >
                  {status}:{" "}
                  {
                    categoryTasks.filter((task) => task.status === status)
                      .length
                  }
                </Badge>
              ))}
            </div>
          </div>
        ))}
        {/* <div className="mt-6">
          <h3 className="text-sm font-semibold mb-2">Overall Task Timeline</h3>
          <div className="relative pt-1">
            <div className="flex mb-2 items-center justify-between">
              <div>
                <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-teal-600 bg-teal-200">
                  {tasks[0].start_date}
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-teal-600 bg-teal-200">
                  {tasks[tasks.length - 1].due_date}
                </span>
              </div>
            </div>
            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-700">
              <div
                style={{ width: "45%" }}
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-teal-500"
              ></div>
            </div>
          </div>
        </div> */}
      </CardContent>
    </Card>
  );
}
