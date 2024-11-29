import { Skeleton } from "../ui/skeleton";

export function ProjectRowSkeleton() {
  return (
    <>
      <div className="flex items-start flex-grow mb-4 space-x-16">
        <Skeleton className="h-8 min-w-64  mb-2 bg-gray-700" />
        <Skeleton className="h-8 min-w-30  mb-1 bg-gray-700" />
        {/* 
        <Skeleton className="h-8 min-w-30  bg-gray-700" /> */}
      </div>
    </>
  );
}
