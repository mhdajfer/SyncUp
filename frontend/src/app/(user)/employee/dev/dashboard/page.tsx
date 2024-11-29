"use client";

import { getDevTasks } from "@/api/projectService/project";
// import TaskCards from "@/Components/Cards/TaskCards";
import TasksBoard from "@/Components/Dashboard/TasksBoard";
import { Task } from "@/interfaces/Project";
import { useEffect, useState } from "react";

export default function Page() {
  const [tasks, setTasks] = useState<Task[]>([]);
  useEffect(() => {
    async function getData() {
      const response = await getDevTasks();

      setTasks(response.data);
    }
    getData();
  }, []);
  return (
    <>
      <div className="">
        {/* <TaskCards tasks={tasks} /> */}
        <TasksBoard newTasks={tasks} />
      </div>
    </>
  );
}
