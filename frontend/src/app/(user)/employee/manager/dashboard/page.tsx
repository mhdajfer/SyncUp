"use client";
import { getProjectTasks, getProjects } from "@/api/projectService/project";
import ManagerDashboard from "@/Components/Dashboard/ManagerDashboard";
import { Project, Task } from "@/interfaces/Project";
import { RootState } from "@/store/store";
import { FC, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";

const Page: FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);

  const userId = useSelector((state: RootState) => state.auth.user?._id);
  useEffect(() => {
    async function getTasks(allProjects: Project[]) {
      try {
        for (let i = 0; i < allProjects.length; i++) {
          const response = await getProjectTasks(allProjects[i]._id || "");

          if (response.success) {
            setTasks((prevData) => {
              const newTasks = response.data.filter(
                (task) =>
                  !prevData.some(
                    (existingTask) => existingTask._id === task._id
                  )
              );
              return [...prevData, ...newTasks];
            });
          } else toast.error(response.message);
        }
      } catch (error) {
        toast.error("error while retrieving tasks");
        console.error(error);
      }
    }

    async function getAllProjects() {
      try {
        const response = await getProjects();

        setProjects(response.result);
        getTasks(response.result);
      } catch (error) {
        toast.error("error while retrieving tasks");
        console.error(error);
      }
    }
    getAllProjects();
  }, [projects.length, userId]);

  console.log(tasks);
  return (
    <>
      {tasks && projects && (
        <ManagerDashboard tasks={tasks} projects={projects} />
      )}
    </>
  );
};

export default Page;
