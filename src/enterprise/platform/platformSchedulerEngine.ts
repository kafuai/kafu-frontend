import {
  PlatformScheduledTask,
  PlatformScheduler,
} from "./platformScheduler";

export class PlatformSchedulerEngine {
  constructor(private readonly scheduler: PlatformScheduler) {}

  activeTasks(): PlatformScheduledTask[] {
    return this.scheduler
      .list()
      .filter((task) => task.enabled);
  }

  findTask(id: string): PlatformScheduledTask | undefined {
    return this.scheduler
      .list()
      .find((task) => task.id === id);
  }
}