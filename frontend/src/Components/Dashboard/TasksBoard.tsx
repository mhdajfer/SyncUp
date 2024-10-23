"use client";

import React, { useEffect, useState } from "react";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import { CalendarIcon } from "lucide-react";
import { Task } from "@/interfaces/Project";
import TaskCards from "../Cards/TaskCards";

const TaskCard: React.FC<{ task: Task }> = ({ task }) => {
  return (
    <Card className="mb-4 cursor-grab active:cursor-grabbing">
      <CardHeader>
        <CardTitle className="text-sm font-medium">{task.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-2">
          <Badge
            variant={
              task.priority === "high"
                ? "destructive"
                : task.priority === "medium"
                ? "default"
                : "secondary"
            }
          >
            {task.priority}
          </Badge>
          <div className="flex items-center">
            <CalendarIcon className="w-4 h-4 mr-1" />
            <span className="text-xs">{task.due_date}</span>
          </div>
        </div>
        <div className="flex items-center">
          <Avatar className="w-6 h-6 mr-2">
            <AvatarImage
              src={
                typeof task.assignee === "object"
                  ? task.assignee.avatar
                  : undefined
              }
            />
            <AvatarFallback>
              {typeof task.assignee === "object"
                ? task.assignee.firstName.charAt(0)
                : task.assignee.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <span className="text-xs">
            {typeof task.assignee === "object"
              ? task.assignee.firstName
              : task.assignee}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

const SortableTaskCard: React.FC<{ task: Task }> = ({ task }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: task._id ? task._id : task.title });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className=" my-6"
    >
      {/* <TaskCard task={task} /> */}
      <TaskCards task={task} />
    </div>
  );
};

const Column: React.FC<{ title: string; tasks: Task[]; status: string }> = ({
  title,
  tasks,
}) => {
  return (
    <>
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #2d3748;
          border-radius: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #4a5568;
          border-radius: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #718096;
        }
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #4a5568 #2d3748;
        }
      `}</style>
      <div className="border border-gray-600  p-4 rounded-lg w-full md:w-1/3 md:h-[600px] md:overflow-y-auto custom-scrollbar">
        <h2 className="text-lg font-semibold mb-4">{title}</h2>
        <SortableContext items={tasks} strategy={verticalListSortingStrategy}>
          {tasks.length === 0 ? (
            <div className=" text-center text-gray-200">No tasks yet</div>
          ) : (
            <div className="">
              {tasks.map((task) => (
                <SortableTaskCard key={task._id} task={task} />
              ))}
            </div>
          )}
        </SortableContext>
      </div>
    </>
  );
};

export default function TaskDashboard({ newTasks }: { newTasks: Task[] }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    setTasks(newTasks);
    console.log("re-rendered");
  }, [newTasks]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    console.log(active);
    if (active.id !== over?.id) {
      setTasks((items) => {
        const oldIndex = items.findIndex((item) => item._id === active.id);
        const newIndex = items.findIndex((item) => item._id === over?.id);

        const newStatus = items[newIndex].status;
        console.log(
          "changing status from ",
          items[oldIndex].status,
          "to",
          newStatus
        );

        return arrayMove(items, oldIndex, newIndex).map((item, index) => {
          if (index === newIndex) {
            return { ...item, status: newStatus };
          }
          return item;
        });
      });
    }
  };

  const getColumnTasks = (status: string) => {
    return tasks.filter((task) => task.status === status);
  };

  const dummyTask = {
    _id: "3",
    title: "Implement login functionality",
    projectId: "proj1",
    status: "pending",
    assignee: "asdfadfasdfadfa",
    priority: "high",
    due_date: "2024-11-10",
  };

  return (
    <div className="p-4 bg-gray-800 text-white rounded-md m-3">
      <h1 className="text-2xl font-bold mb-6">Task Dashboard</h1>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragEnd={handleDragEnd}
      >
        <div className="flex flex-col md:flex-row gap-4">
          <Column
            title="Not Started"
            tasks={getColumnTasks("In Progress")}
            status="not_started"
          />
          <Column
            title="Pending"
            tasks={getColumnTasks("pending")}
            status="pending"
          />
          <Column
            title="Completed"
            tasks={getColumnTasks("Completed")}
            status="completed"
          />
        </div>
        <DragOverlay>{<TaskCard task={dummyTask} />}</DragOverlay>
      </DndContext>
    </div>
  );
}
