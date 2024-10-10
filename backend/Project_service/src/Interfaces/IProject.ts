export interface IProject {
  _id?: string;
  name: string;
  description: string;
  managerId: string;
  start_date: Date;
  due_date: Date;
  status: string;
  budget: number;
  goal: string;
  document: string | null;
  created_by: string;
}

export interface Task {
  title: string;
  desc?: string;
  assignee: string;
  projectId: string;
  status?: string;
  priority?: string;
  due_date: Date;
  remarks?: string;
}
