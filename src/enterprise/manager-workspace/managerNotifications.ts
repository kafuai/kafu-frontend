import { ManagerTask } from "./managerWorkspaceTypes";

export class ManagerNotifications {
  constructor(private readonly tasks: ManagerTask[]) {}

  getCriticalNotifications(): ManagerTask[] {
    return this.tasks.filter((task) => task.priority === "critical");
  }
}
