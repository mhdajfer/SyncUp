import mongoose from "mongoose";

export interface IProject {
  _id?: mongoose.Types.ObjectId;
  name: string;
  description: string;
  managerId: string;
  start_date: Date;
  due_date: Date;
  status: string;
  task_ids: Array<mongoose.Types.ObjectId>;
  budget: number;
  goal: string;
  document: File;
}
