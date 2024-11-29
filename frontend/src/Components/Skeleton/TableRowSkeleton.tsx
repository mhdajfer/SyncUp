import { Skeleton } from "@/Components/ui/skeleton";

const TableRowSkeleton = () => (
  <div className="flex items-start flex-grow mb-4 space-x-16">
    <Skeleton className="h-8 min-w-64  mb-2 bg-gray-700" />
    <Skeleton className="h-8 min-w-64  mb-1 bg-gray-700" />
    <Skeleton className="h-8 min-w-64  bg-gray-700" />
  </div>
);

export default TableRowSkeleton;
