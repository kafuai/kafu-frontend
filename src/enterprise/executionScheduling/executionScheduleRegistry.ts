import type { ExecutionSchedule } from "./executionSchedule";

export class ExecutionScheduleRegistry {
  private readonly schedules = new Map<string, ExecutionSchedule>();

  register(schedule: ExecutionSchedule): void {
    this.schedules.set(schedule.id, schedule);
  }

  get(scheduleId: string): ExecutionSchedule | undefined {
    return this.schedules.get(scheduleId);
  }

  has(scheduleId: string): boolean {
    return this.schedules.has(scheduleId);
  }

  list(): readonly ExecutionSchedule[] {
    return Array.from(this.schedules.values());
  }

  remove(scheduleId: string): boolean {
    return this.schedules.delete(scheduleId);
  }
}