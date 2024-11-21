import { Skeleton } from "@/Components/ui/skeleton";

const MessageSkeleton = () => (
  <div className="flex items-start mb-4">
    <Skeleton className="w-10 h-10 rounded-full mr-2 bg-gray-700" />
    <div className="flex-grow">
      <Skeleton className="h-4 w-1/4 mb-2 bg-gray-700" />
      <Skeleton className="h-4 w-3/4 mb-1 bg-gray-700" />
      <Skeleton className="h-4 w-1/2 bg-gray-700" />
    </div>
  </div>
);

export default MessageSkeleton;
