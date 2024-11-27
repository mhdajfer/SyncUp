import { CurrentSubscriptions } from "@/Components/Cards/subscriptions/CurrentSubscription";
import { SubscriptionHistory } from "@/Components/Cards/subscriptions/SubscriptionHistory";
import { Suspense } from "react";

export default function page() {
  return (
    <div className="min-h-screen  w-full bg-gray-900 text-gray-100 py-4  px-8 mt-[-40px]">
      <div className="container">
        <h1 className="text-4xl font-bold mb-10 text-gray-100">
          Subscription Management
        </h1>
        <div className="flex flex-col space-y-10">
          <Suspense
            fallback={
              <div className="text-gray-400">
                Loading current subscriptions...
              </div>
            }
          >
            <CurrentSubscriptions role="sAdmin" />
          </Suspense>
          <Suspense
            fallback={
              <div className="text-gray-400">
                Loading subscription history...
              </div>
            }
          >
            <SubscriptionHistory role="sAdmin" />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
