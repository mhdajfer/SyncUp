import { IUser } from "./IUser";

export interface IProject {
  _id?: string;
  name: string;
  description: string;
  managerId: string;
  start_date: Date;
  due_date: Date;
  developers?: string[];
  status: string;
  budget: number;
  goal: string;
  document: string | null;
  created_by: string;
}

export interface Task {
  _id?: string;
  title: string;
  desc?: string;
  category: string;
  assignee: string;
  projectId: string;
  status?: string;
  priority?: string;
  start_date: Date;
  due_date: Date;
  log_time: {
    start_time: Date;
    stop_time: Date;
    total_time: number;
  };
  remarks?: string;
  comments: Comment[];
}

export interface Comment {
  _id?: string;
  author: string;
  content: string;
  timeStamp: Date;
}
