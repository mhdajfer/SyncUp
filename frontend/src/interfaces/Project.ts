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
  comments?: Comment[];
  created_by: string;
}

<<<<<<< Updated upstream
=======
export interface Task {
  _id?: string;
  title: string;
  projectId: string;
  status: string;
  desc?: string;
  assignee: string | User;
  priority?: string;
  due_date: string;
  remarks?: string;
}

>>>>>>> Stashed changes
interface Comment {
  id: string;
  author: string;
  content: string;
  timestamp: string;
}
