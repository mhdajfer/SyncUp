import mongoose from "mongoose";

export interface IProject {
  _id?: string;
  name: string;
  description: string;
  managerId: string;
  start_date: Date;
  due_date: Date;
  status: string;
  task_ids: string[];
  budget: number;
  goal: string;
  document: string | null;
  created_by: string;
}
<<<<<<< Updated upstream
=======

export interface Task {
  _id?: string;
  title: string;
  desc?: string;
  assignee: string;
  projectId: string;
  status?: string;
  priority?: string;
  due_date: Date;
  remarks?: string;
}
>>>>>>> Stashed changes
