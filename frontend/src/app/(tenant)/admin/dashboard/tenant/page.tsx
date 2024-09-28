import TenantCard from "@/Components/Cards/TenantCard";
import { Button } from "@/Components/ui/button";

export default function page() {
 
  return (
    <>
      <div>
        <div className="mb-3 flex pe-6">
          <Button
            className={`min-w-20 bg-violet-800 text-white hover:bg-violet-900 ms-auto`}
          >
            <a href="tenant/create">Create</a>
          </Button>
        </div>
        <TenantCard  />
      </div>
    </>
  );
}
