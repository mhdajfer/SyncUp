"use client";

import { useEffect, useState } from "react";
import { Button } from "@/Components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/Components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/Components/ui/alert-dialog";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { User } from "@/interfaces/User";
import {
  disableSubscription,
  editSubscriptionPlan,
  getSubscriptionPlan,
  getUser,
} from "@/api/userService/user";
import { updateUserDetails } from "@/store/slices/authSlice";
import { toast } from "sonner";
import { Badge } from "@/Components/ui/badge";
import { Input } from "@/Components/ui/input";
import { SubscriptionPlan } from "@/interfaces/SubscriptionPlan";
import { AxiosError } from "axios";

export function CurrentSubscriptions({
  role = "admin",
}: {
  role?: "admin" | "sAdmin";
}) {
  const router = useRouter();
  const dispatch = useDispatch();
  const [subscriptions, setSubscriptions] = useState<SubscriptionPlan[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedFields, setEditedFields] = useState<Partial<SubscriptionPlan>>({
    name: "",
    amount: 0,
  });
  const user = useSelector((state: RootState) => state.auth.user) as User;

  useEffect(() => {
    async function getSubPlan() {
      try {
        const response = await getSubscriptionPlan();

        if (response.success) {
          setSubscriptions([response.data]);
        }
      } catch (error: unknown) {
        if (error instanceof AxiosError) {
          toast.error(error.response?.data.error);
        } else {
          toast.error("error while retrieving subscription plan");
          console.log(error);
        }
      }
    }

    getSubPlan();
  }, []);

  const activateSub = async (amount: number) => {
    try {
      if (!user._id) return toast.error("user not found");

      const response = await getUser(user._id);

      if (response.success && response.data.subscriptionStatus) {
        toast.error("User already subscribed");
      } else {
        localStorage.setItem("total-price", amount.toString());

        router.push("/payments");
      }
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.error);
      } else {
        toast.error("error while subscribing");
        console.log(error);
      }
    }
  };

  const disableSubs = async () => {
    try {
      const response = await disableSubscription();

      if (response.success) {
        dispatch(updateUserDetails(response.data));

        toast.success(response.message);
      }
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.error);
      } else {
        toast.error("error while unsubscribing");
      }
      console.log(error);
    }
  };

  const handleEditClick = (sub: SubscriptionPlan) => {
    setEditingId(sub._id ?? null);
    setEditedFields({
      name: sub.name,
      amount: sub.amount,
    });
  };

  const handleFieldChange = (
    field: "name" | "amount",
    value: string | number
  ) => {
    setEditedFields((prev) => ({ ...prev, [field]: value }));
  };

  const handleEditSubmit = async () => {
    try {
      const response = await editSubscriptionPlan(editedFields);

      if (response.success) {
        setEditingId(null);
        setSubscriptions([response.data]);
        toast.success(response.message);
      }
    } catch (error: unknown) {
      if (error instanceof AxiosError && error.response) {
        toast.message("Create a new tenant");
      }
      console.log(error);
      toast.error("Failed to update subscription");
    }
  };

  return (
    <Card className="bg-gray-800 border-gray-700 w-full">
      <CardHeader>
        <CardTitle className="text-gray-100">Current Subscriptions</CardTitle>
        <CardDescription className="text-gray-400">
          Manage your active subscriptions{subscriptions.length}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex space-x-28">
          {subscriptions.map((sub) => (
            <div
              key={sub._id}
              className={`mb-4 p-4 border border-gray-700 rounded-lg bg-gray-800 w-full ${
                editingId === sub._id ? "h-fit" : "md:h-48"
              }`}
            >
              {editingId === sub._id ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label
                      htmlFor="name"
                      className="text-sm font-medium text-gray-200"
                    >
                      Name
                    </label>
                    <Input
                      id="name"
                      type="text"
                      value={editedFields?.name}
                      onChange={(e) =>
                        handleFieldChange("name", e.target.value)
                      }
                      className="bg-gray-700 border-gray-600 text-gray-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="price"
                      className="text-sm font-medium text-gray-200"
                    >
                      Price
                    </label>
                    <Input
                      id="price"
                      type="number"
                      value={editedFields?.amount}
                      onChange={(e) =>
                        handleFieldChange("amount", e.target.value)
                      }
                      className="bg-gray-700 border-gray-600 text-gray-200"
                    />
                  </div>
                  <Button
                    className="bg-blue-600 text-gray-100 hover:bg-blue-700"
                    onClick={handleEditSubmit}
                  >
                    Submit
                  </Button>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-semibold text-gray-100">
                      {sub.name}
                    </h3>
                    {role === "admin" && (
                      <Badge
                        className="text-gray-100 bg-black hover:bg-slate-800"
                        variant={
                          user?.subscriptionStatus ? "default" : "secondary"
                        }
                      >
                        {user?.subscriptionStatus ? "active" : "Inactive"}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-400">
                    Price: {sub.amount}/month
                  </p>
                  <p className="text-sm text-gray-400">
                    Next renewal: {Date.now().toString()}
                  </p>
                  {role === "admin" ? (
                    user.subscriptionStatus ? (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            className="mt-10 border-none text-neutral-400 hover:bg-red-800 hover:text-neutral-50 bg-red-900"
                          >
                            Cancel Subscription
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-gray-800 border-gray-700">
                          <AlertDialogHeader>
                            <AlertDialogTitle className="text-gray-100">
                              Are you sure?
                            </AlertDialogTitle>
                            <AlertDialogDescription className="text-gray-400">
                              This action cannot be undone. This will cancel
                              your subscription immediately.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="bg-gray-700 text-gray-100 hover:bg-gray-600">
                              Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => disableSubs()}
                              className="bg-red-600 text-gray-100 hover:bg-red-700"
                            >
                              Confirm
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    ) : (
                      <Button
                        className="bg-blue-600 text-gray-100 hover:bg-blue-700 mt-10"
                        onClick={() => {
                          activateSub(sub.amount);
                        }}
                      >
                        Subscribe
                      </Button>
                    )
                  ) : (
                    <Button
                      className="bg-green-600 text-gray-100 hover:bg-green-700 mt-10"
                      onClick={() => handleEditClick(sub)}
                    >
                      Edit Subscription
                    </Button>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter></CardFooter>
    </Card>
  );
}
