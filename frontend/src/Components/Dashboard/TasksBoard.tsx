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
import { CalendarDays, User } from "lucide-react";
import { Task } from "@/interfaces/Project";
// import TaskCards from "../Cards/TaskCards";
import { useRouter } from "next/navigation";
import { format } from "date-fns";

export function TaskCards({ task }: { task: Task }) {
  const router = useRouter();

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: task._id ? task._id : task.title });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  return (
    <>
      {task && (
        <div className="bg-gray-900 p-4 rounded-md shadow w-full h-full">
          <h3
            className="text-lg font-semibold text-gray-100 mb-2 hover:underline cursor-pointer hover:text-gray-200"
            onClick={() => router.push(`tasks/${task._id}`)}
          >
            {task.title}
          </h3>
          <div
            className="flex flex-wrap gap-4"
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
          >
            <div className="flex items-center text-gray-300">
              <CalendarDays className="w-4 h-4 mr-2" />
              <span>{format(new Date(task.due_date), "MMMM dd, yyyy")}</span>
            </div>
            <div className="flex items-center text-gray-300">
              <User className="w-4 h-4 mr-2" />
              {typeof task.assignee === "string" ? (
                <span>{task.assignee}</span>
              ) : (
                <span>
                  {task.assignee.firstName} {task.assignee.lastName}
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

const SortableTaskCard: React.FC<{ task: Task }> = ({ task }) => {
  return (
    <>
      <div className=" my-6">
        {/* <TaskCard task={task} /> */}
        <TaskCards task={task} />
      </div>
    </>
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
        <SortableContext
          items={tasks.map((task) => task._id || 1)}
          strategy={verticalListSortingStrategy}
        >
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
        <DragOverlay>{<TaskCards task={dummyTask} />}</DragOverlay>
      </DndContext>
    </div>
  );
}
