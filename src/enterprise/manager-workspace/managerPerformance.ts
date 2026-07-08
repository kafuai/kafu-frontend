import { ManagerTask } from "./managerWorkspaceTypes";

export class ManagerPerformance {
  constructor(private readonly tasks: ManagerTask[]) {}

  getCompletionRate(): number {
    if (this.tasks.length === 0) return 0;
    const completed = this.tasks.filter((task) => task.status === "completed").length;
    return Math.round((completed / this.tasks.length) * 100);
  }
}
