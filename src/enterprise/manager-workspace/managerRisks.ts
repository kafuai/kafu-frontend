import { ManagerTask } from "./managerWorkspaceTypes";

export class ManagerRisks {
  constructor(private readonly tasks: ManagerTask[]) {}

  getBlockedRisks(): ManagerTask[] {
    return this.tasks.filter((task) => task.status === "blocked");
  }
}
