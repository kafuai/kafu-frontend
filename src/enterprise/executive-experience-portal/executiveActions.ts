import { ExecutiveAction } from "./executiveExperienceTypes";

export class ExecutiveActions {
  constructor(private readonly actions: ExecutiveAction[]) {}

  getPending(): ExecutiveAction[] {
    return this.actions.filter((action) => action.status === "pending");
  }

  getAll(): ExecutiveAction[] {
    return this.actions;
  }
}
