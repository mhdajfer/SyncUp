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
