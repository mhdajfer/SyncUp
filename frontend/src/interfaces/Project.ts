import { User } from "./User";

export interface Project {
  _id?: string;
  name: string;
  description: string;
  managerId: string;
  start_date: string;
  due_date: string;
  status: string;
  budget: number;
  goal: string;
  document: File | null;
  comments?: Comment[];
  created_by: string;
}

export interface Task {
  title: string;
  projectId: string;
  status: string;
  desc?: string;
  assignee: string | User;
  priority?: string;
  due_date: string;
  remartks?: string;
}

interface Comment {
  id: string;
  author: string;
  content: string;
  timestamp: string;
}
