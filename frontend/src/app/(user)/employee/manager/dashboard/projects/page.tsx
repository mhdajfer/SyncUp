"use client";
import { getProjects } from "@/api/projectService/project";
import ProjectCard from "@/Components/Cards/ProjectCard";
import NoData from "@/Components/NoData/NoData";
import { Project } from "@/interfaces/Project";
import { useRouter } from "next/navigation";
import { Input } from "@/Components/ui/input";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
export default function Page() {
  const router = useRouter();
  const [projectList, setProject] = useState<Project[]>([]);
  const [query, setQuery] = useState("");
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);

  useEffect(() => {
    async function getData() {
      const data = await getProjects();
      setProject(data.result);
    }
    getData();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value.toLowerCase();
    setQuery(newQuery);
    const filtered = projectList.filter((project) =>
      project.name.toLowerCase().includes(newQuery)
    );
    setFilteredProjects(filtered);
  };

  return (
    <>
      <div className="my-4 w-full flex justify-end pe-14">
        <button
          type="button"
          className="text-white bg-violet-900 border border-gray-500 hover:bg-violet-800 font-medium rounded-lg text-sm px-2 py-1 me-2"
          onClick={() => router.push("projects/create")}
        >
          new Project
        </button>
      </div>

      <div className="relative w-full max-w-md mx-auto mb-6">
        <Input
          type="text"
          placeholder="Search projects..."
          value={query}
          onChange={handleSearch}
          className="pl-10 bg-gray-800 text-white border-gray-700 focus:border-blue-500"
        />
        <Search
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          size={18}
        />
      </div>
      {query && filteredProjects.length > 0 ? (
        <div className="flex flex-wrap justify-center px-8 ">
          {filteredProjects.map((project, i) => (
            <ProjectCard project={project} key={i} />
          ))}
        </div>
      ) : query && filteredProjects.length === 0 ? (
        <NoData />
      ) : (
        <div className="flex flex-wrap justify-center px-8 ">
          {projectList.map((project, i) => (
            <ProjectCard project={project} key={i} />
          ))}
        </div>
      )}
    </>
  );
}
