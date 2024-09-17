import UserForm from "@/Components/Forms/UserForm";
import { Card, CardDescription, CardTitle } from "@/Components/ui/card";

export default function Page() {
  return (
    <>
      <div className="min-h-screen w-full py-10  flex flex-col items-center ">
        <div className=" w-full max-w-lg">
          <Card className="bg-[#082032] text-white border-0 text-center">
            <CardTitle className="text-2xl">Add New Developer</CardTitle>
            <CardDescription>
              Fill in the details to add new developer.
            </CardDescription>
          </Card>
        </div>
        <div className="w-full py-8 ">
          <UserForm role="dev" />
        </div>
      </div>
    </>
  );
}
