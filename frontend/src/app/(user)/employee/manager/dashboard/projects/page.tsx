"use client";
import { getProjects } from "@/api/projectService/project";
import ProjectsTable from "@/Components/Tables/ProjectsTable";
import { Project } from "@/interfaces/Project";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
export default function Page() {
  const router = useRouter();
  const [projectList, setProject] = useState<Project[]>([]);

  useEffect(() => {
    async function getData() {
      const data = await getProjects();
      setProject(data.result);
    }
    getData();
  }, []);

  console.log(projectList);

  return (
    <>
      <div className="my-4 w-full flex justify-end pe-14">
        <button
          type="button"
          className="text-gray-900 bg-white border border-gray-300 hover:bg-gray-200 font-medium rounded-lg text-sm px-2 py-1 me-2"
          onClick={() => router.push("projects/create")}
        >
          new Project
        </button>
      </div>
      <ProjectsTable projectList={projectList} />
    </>
  );
}
