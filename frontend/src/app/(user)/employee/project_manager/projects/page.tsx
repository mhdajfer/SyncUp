"use client";
import { getProjects } from "@/api/projectService/project";
import ProjectCard from "@/Components/Cards/ProjectCard";
import NoData from "@/Components/NoData/NoData";
import { Project } from "@/interfaces/Project";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
export default function Page() {
  const router = useRouter();
  const [projectList, setProject] = useState<Project[]>([]);

  useEffect(() => {
    async function getData() {
      const data = await getProjects(true);
      setProject(data.result);
    }
    getData();
  }, []);

  console.log(projectList);

  return (
    <>
      {projectList.length > 0 ? (
        <div className="flex flex-wrap justify-center px-8 ">
          {projectList.map((project, i) => (
            <ProjectCard project={project} key={i} />
          ))}
        </div>
      ) : (
        <NoData />
      )}
    </>
  );
}
