export type ManagerPriority =
  | "low"
  | "medium"
  | "high"
  | "critical";

export type ManagerTaskStatus =
  | "todo"
  | "in_progress"
  | "blocked"
  | "completed";

export interface TeamMember {
  id: string;
  name: string;
  role: string;
}

export interface ManagerTask {
  id: string;
  title: string;
  owner: string;
  priority: ManagerPriority;
  status: ManagerTaskStatus;
}

export interface ManagerWorkspaceModel {
  id: string;
  manager: string;
  team: TeamMember[];
  tasks: ManagerTask[];
}
