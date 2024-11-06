import { User } from "./User";

export interface Project {
  _id?: string;
  name: string;
  description: string;
  managerId: string | User;
  start_date: string;
  due_date: string;
  status: string;
  budget: number;
  goal: string;
  developers?: User[];
  document: File | null;
  created_by: string;
}

export interface Task {
  _id?: string;
  comments: Comment[];
  title: string;
  projectId: string;
  status: string;
  category: string;
  desc?: string;
  log_time: {
    start_time: string;
    stop_time: string;
    total_time: number;
  };
  assignee: string | User;
  priority?: string;
  start_date: string;
  due_date: string;
  remarks?: string;
}

export interface Comment {
  _id?: string;
  author: string | User;
  content: string;
  timeStamp: string;
}

export enum TaskCategory {
  "Feature",
  "Bug",
  "Testing",
  "Planning",
}
