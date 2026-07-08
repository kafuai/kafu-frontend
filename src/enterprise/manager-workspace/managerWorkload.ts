import { ManagerTask } from "./managerWorkspaceTypes";

export class ManagerWorkload {
  constructor(private readonly tasks: ManagerTask[]) {}

  getHighPriorityWorkload(): ManagerTask[] {
    return this.tasks.filter(
      (task) => task.priority === "high" || task.priority === "critical"
    );
  }
}
