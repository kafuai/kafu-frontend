import type { EnterpriseExecutionActivity } from "./activityTypes";

export class ActivityRegistry {
  private readonly activities = new Map<string, EnterpriseExecutionActivity>();

  register(activity: EnterpriseExecutionActivity): void {
    this.activities.set(activity.id, activity);
  }

  get(id: string): EnterpriseExecutionActivity | undefined {
    return this.activities.get(id);
  }

  getAll(): EnterpriseExecutionActivity[] {
    return [...this.activities.values()];
  }

  remove(id: string): boolean {
    return this.activities.delete(id);
  }

  clear(): void {
    this.activities.clear();
  }

  size(): number {
    return this.activities.size;
  }
}