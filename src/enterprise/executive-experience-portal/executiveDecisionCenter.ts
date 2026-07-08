import {
  ExecutiveAction,
  ExecutiveDecisionStatus,
} from "./executiveExperienceTypes";

export class ExecutiveDecisionCenter {
  constructor(private readonly actions: ExecutiveAction[]) {}

  getByStatus(status: ExecutiveDecisionStatus): ExecutiveAction[] {
    return this.actions.filter((action) => action.status === status);
  }

  getDecisionBacklog(): ExecutiveAction[] {
    return this.actions.filter(
      (action) => action.status === "draft" || action.status === "pending"
    );
  }
}
