"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge";
import { Task } from "@/interfaces/Project";
import { differenceInSeconds } from "date-fns";
import { editTask } from "@/api/projectService/project";
import { toast } from "sonner";

export default function LogTime({
  setTask,
  task,
}: {
  setTask: (updateFn: (task: Task) => Task) => void;
  task: Task;
}) {
  const [isLogging, setIsLogging] = useState(false);
  const [totalLogTime, setTotalLogTime] = useState("");
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const updateTaskOnServer = async (updatedTask: Task) => {
    try {
      const response = await editTask(updatedTask);

      if (response.success) toast.success("log updated");
    } catch (error: unknown) {
      console.error("Failed to update task on the server:", error);
      toast.error("Failed to update task on the server");
    }
  };

  const startLogging = () => {
    if (!isLogging) {
      const startTime = new Date().toISOString();
      setIsLogging(true);

      const updatedTask = {
        ...task,
        log_time: {
          ...task.log_time,
          start_time: startTime,
          stop_time: "",
        },
      };

      // Update the state first
      setTask((prevTask) => ({
        ...prevTask,
        ...updatedTask,
      }));

      // Make the API call to update the task on the server
      updateTaskOnServer(updatedTask);

      intervalRef.current = setInterval(() => {
        console.log(`Log entry at ${new Date().toLocaleTimeString()}`);
      }, 2000);
    }
  };

  const stopLogging = () => {
    console.log("stops");
    const stopTime = new Date().toISOString();
    setIsLogging(false);

    const startTime = new Date(task.log_time.start_time).getTime();
    const endTime = new Date(stopTime).getTime();
    const totalSeconds = differenceInSeconds(endTime, startTime);

    const updatedTask = {
      ...task,
      log_time: {
        ...task.log_time,
        stop_time: stopTime,
        start_time: "",
        total_time: (task.log_time.total_time || 0) + totalSeconds,
      },
    };

    // Update the state first
    setTask((prevTask) => ({
      ...prevTask,
      ...updatedTask,
    }));

    // Make the API call to update the task on the server
    updateTaskOnServer(updatedTask);

    const formattedLogTime = formatToHHMMSS(updatedTask.log_time.total_time);

    setTotalLogTime(formattedLogTime);

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    console.log("Logging stopped");
  };

  const formatToHHMMSS = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return [hours, minutes, secs]
      .map((val) => String(val).padStart(2, "0")) // Ensure 2-digit formatting
      .join(":");
  };

  useEffect(() => {
    const formattedLogTime = formatToHHMMSS(task.log_time.total_time);

    setTotalLogTime(formattedLogTime);
  }, [task.log_time.total_time]);

  return (
    <div className=" my-4 w-full max-w-md mx-auto p-4 space-y-4 flex flex-col items-center  ">
      <h3 className="text-lg font-bold underline">Time Tracking</h3>

      <div className="flex justify-center items-center space-x-4">
        <Button
          onClick={startLogging}
          disabled={task.log_time.start_time ? true : false}
        >
          Start Log
        </Button>
        <Button
          onClick={stopLogging}
          disabled={task.log_time.stop_time ? true : false}
        >
          Stop Log
        </Button>
        <Badge variant={task.log_time.start_time ? "default" : "secondary"}>
          {task.log_time.start_time ? "started" : "Not started"}
        </Badge>
      </div>
      <div>
        <h3>
          <span className="text-neutral-300">
            {task.log_time.total_time
              ? ` Total Time Logged : `
              : ` Not started working yet!`}
          </span>
          <span className="text-gray-400 font-extralight text-sm">
            {totalLogTime}
          </span>
        </h3>
      </div>
    </div>
  );
}
