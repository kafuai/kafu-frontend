import { ExecutiveGoal } from "./executiveExperienceTypes";

export class ExecutiveGoals {
  constructor(private readonly goals: ExecutiveGoal[]) {}

  getStrategicProgress(): number {
    if (this.goals.length === 0) return 0;
    const total = this.goals.reduce((sum, goal) => sum + goal.progress, 0);
    return Math.round(total / this.goals.length);
  }

  getGoals(): ExecutiveGoal[] {
    return this.goals;
  }
}
