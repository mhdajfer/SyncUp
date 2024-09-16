import ProjectForm from "@/Components/Forms/ProjectForm";
import { Card, CardDescription, CardTitle } from "@/Components/ui/card";

export default function Page() {
  return (
    <>
      <div className="flex flex-col space-y-8 my-14 items-center justify-center">
        <Card className="bg-[#082032] text-white border-0 text-center">
          <CardTitle className="text-2xl">Create New Project</CardTitle>
          <CardDescription>
            Fill in the details to create a new project.
          </CardDescription>
        </Card>
        <ProjectForm />
      </div>
    </>
  );
}
