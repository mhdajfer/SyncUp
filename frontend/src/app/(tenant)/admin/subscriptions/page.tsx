import { CurrentSubscriptions } from "@/Components/Cards/subscriptions/CurrentSubscription";
import { SubscriptionHistory } from "@/Components/Cards/subscriptions/SubscriptionHistory";
import MessageSkeleton from "@/Components/Skeleton/MessageSkeleton";
import { Suspense } from "react";

export default function page() {
  return (
    <div className="min-h-screen  w-full bg-gray-900 text-gray-100 py-4  px-8 mt-[-40px]">
      <div className="container">
        <h1 className="text-4xl font-bold mb-10 text-gray-100">
          Subscription Management
        </h1>
        <div className="flex flex-col space-y-10">
          <Suspense fallback={<MessageSkeleton />}>
            <CurrentSubscriptions role="admin" />
          </Suspense>
          <Suspense
            fallback={
              <div>
                <MessageSkeleton />
                <MessageSkeleton />
                <MessageSkeleton />
                <MessageSkeleton />
              </div>
            }
          >
            <SubscriptionHistory />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
