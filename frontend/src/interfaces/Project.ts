export interface Project {
  _id?: string;
  name: string;
  description: string;
  managerId: string;
  start_date: string;
  due_date: string;
  status: string;
  task_ids: string[];
  budget: number;
  goal: string;
  document: File | null;
}
