"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { AlertCircle, CheckCircle } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { setPasswordAndCreateUser } from "@/api/userService/user";
import { toast } from "sonner";

export default function SetPassword() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    if (!token) return toast.warning("You are not invited to join this....");

    const response = await setPasswordAndCreateUser(token, password);

    console.log(response);
    setSuccess(true);
    setError("");
    setTimeout(() => {
      router.replace("syncup.mhdajfer.in/login");
    });
  };

  const popupVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 50 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      y: 50,
      transition: { duration: 0.3, ease: "easeIn" },
    },
  };

  return (
    <>
      <AnimatePresence>
        {isVisible && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-slate-900 rounded-lg shadow-xl max-w-md w-full p-6"
              variants={popupVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <h2 className="text-2xl font-bold text-white mb-4">
                Set New Password
              </h2>

              {!success ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="new-password" className="text-white">
                      New Password
                    </Label>
                    <Input
                      id="new-password"
                      type="password"
                      placeholder="Enter new password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="bg-gray-700 text-white border-gray-600"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password" className="text-white">
                      Confirm Password
                    </Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      placeholder="Confirm new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="bg-gray-700 text-white border-gray-600"
                    />
                  </div>
                  {error && (
                    <motion.div
                      className="flex items-center text-red-500 space-x-2"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <AlertCircle size={16} />
                      <span>{error}</span>
                    </motion.div>
                  )}
                  <Button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Set New Password
                  </Button>
                </form>
              ) : (
                <motion.div
                  className="flex flex-col items-center text-green-400 space-y-4"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <CheckCircle size={48} />
                  <p className="text-lg font-semibold">
                    Password successfully updated!
                  </p>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
