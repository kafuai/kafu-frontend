import { ManagerTask } from "./managerWorkspaceTypes";

export class ManagerTasks {
  constructor(private readonly tasks: ManagerTask[]) {}

  getOpenTasks(): ManagerTask[] {
    return this.tasks.filter(task => task.status !== "completed");
  }
}
