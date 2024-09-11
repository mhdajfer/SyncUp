import mongoose from "mongoose";

export interface ITask {
  _id?: mongoose.Types.ObjectId;
  title: string;
  description: string;
  due_date: Date;
  priority: string;
  remarks: string;
  assignee: mongoose.Types.ObjectId;
}
