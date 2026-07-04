export type PlatformScheduleFrequency =
  | "once"
  | "hourly"
  | "daily"
  | "weekly"
  | "monthly";

export type PlatformScheduledTask = {
  id: string;
  name: string;
  frequency: PlatformScheduleFrequency;
  enabled: boolean;
  createdAt: Date;
};

export class PlatformScheduler {
  private readonly tasks = new Map<string, PlatformScheduledTask>();

  schedule(task: Omit<PlatformScheduledTask, "createdAt">): PlatformScheduledTask {
    const scheduled: PlatformScheduledTask = {
      ...task,
      createdAt: new Date(),
    };

    this.tasks.set(scheduled.id, scheduled);
    return scheduled;
  }

  enable(id: string): void {
    const task = this.tasks.get(id);
    if (task) task.enabled = true;
  }

  disable(id: string): void {
    const task = this.tasks.get(id);
    if (task) task.enabled = false;
  }

  list(): PlatformScheduledTask[] {
    return [...this.tasks.values()];
  }
}