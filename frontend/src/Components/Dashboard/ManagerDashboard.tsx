"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Progress } from "@/Components/ui/progress";
import { Badge } from "@/Components/ui/badge";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { Project, Task } from "@/interfaces/Project";

const dummyProjects = [
  {
    _id: "1",
    name: "E-commerce Platform Development",
    description:
      "Develop a scalable e-commerce platform with multi-vendor support and real-time inventory tracking.",
    managerId: "user1",
    start_date: "2024-01-15",
    due_date: "2024-06-30",
    status: "In Progress",
    budget: 50000,
    goal: "Launch a competitive online shopping experience",
    developers: [],
    document: null,
    created_by: "admin",
  },
  {
    _id: "2",
    name: "Social Media Analytics Tool",
    description:
      "Build an analytics tool for monitoring and analyzing social media trends.",
    managerId: "user2",
    start_date: "2024-02-01",
    due_date: "2024-07-01",
    status: "Not Started",
    budget: 40000,
    goal: "Provide insights into social media engagement for brands",
    developers: [],
    document: null,
    created_by: "admin",
  },
  {
    _id: "3",
    name: "Healthcare Management System",
    description:
      "Develop a platform to manage patient records and streamline hospital operations.",
    managerId: "user3",
    start_date: "2023-11-10",
    due_date: "2024-05-15",
    status: "In Progress",
    budget: 70000,
    goal: "Enhance patient care by providing real-time data",
    developers: [],
    document: null,
    created_by: "admin",
  },
  {
    _id: "4",
    name: "CRM for Small Businesses",
    description:
      "Create a simple and intuitive CRM system for small businesses to manage customer relationships.",
    managerId: "user4",
    start_date: "2024-03-10",
    due_date: "2024-08-20",
    status: "Not Started",
    budget: 30000,
    goal: "Increase small businesses' customer retention",
    developers: [],
    document: null,
    created_by: "admin",
  },
  {
    _id: "5",
    name: "Educational App for Kids",
    description:
      "Build an interactive educational app with gamified content for children.",
    managerId: "user5",
    start_date: "2023-12-01",
    due_date: "2024-04-01",
    status: "Completed",
    budget: 25000,
    goal: "Provide engaging educational content for children",
    developers: [],
    document: null,
    created_by: "admin",
  },
];

const dummyTasks: Task[] = [
  {
    _id: "task1",
    comments: [],
    title: "Design UI mockups",
    projectId: "1",
    status: "Completed",
    category: "Planning",
    assignee: "dev1",
    start_date: "2024-03-01",
    due_date: "2024-03-15",
  },
  {
    _id: "task2",
    comments: [],
    title: "Implement authentication",
    projectId: "1",
    status: "In Progress",
    category: "Feature",
    assignee: "dev2",
    start_date: "2024-03-10",
    due_date: "2024-03-25",
  },
  {
    _id: "task3",
    comments: [],
    title: "Set up CI/CD pipeline",
    projectId: "1",
    status: "To Do",
    category: "Planning",
    assignee: "dev3",
    start_date: "2024-03-20",
    due_date: "2024-04-05",
  },
  {
    _id: "task4",
    comments: [],
    title: "Develop main dashboard",
    projectId: "1",
    status: "In Progress",
    category: "Feature",
    assignee: "dev1",
    start_date: "2024-03-15",
    due_date: "2024-04-15",
  },
  {
    _id: "task5",
    comments: [],
    title: "Write unit tests",
    projectId: "1",
    status: "To Do",
    category: "Testing",
    assignee: "dev2",
    start_date: "2024-04-01",
    due_date: "2024-04-30",
  },
  {
    _id: "task6",
    comments: [],
    title: "Fix responsive layout issues",
    projectId: "1",
    status: "To Do",
    category: "Bug",
    assignee: "dev3",
    start_date: "2024-04-10",
    due_date: "2024-04-20",
  },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28"];

export default function ManagerDashboard({
  tasks = dummyTasks,
  projects = dummyProjects,
}: {
  tasks: Task[];
  projects: Project[];
}) {
  console.log(tasks);

  return (
    <div className="container mx-auto p-4 bg-gray-900 text-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Manager Dashboard</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-20">
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
