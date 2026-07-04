import { RiskSeverity, RiskStatus } from "./riskTypes";

export type RiskMitigationStrategy =
  | "avoid"
  | "reduce"
  | "transfer"
  | "accept";

export type RiskMitigationAction = {
  id: string;
  riskId: string;
  strategy: RiskMitigationStrategy;
  description: string;
  ownerId: string;
  dueDate: string;
  completed: boolean;
};

export type RiskMitigationPlan = {
  id: string;
  riskId: string;
  actions: RiskMitigationAction[];
  residualSeverity: RiskSeverity;
  status: RiskStatus;
};

export function calculateMitigationProgress(
  plan: RiskMitigationPlan,
): number {
  if (plan.actions.length === 0) {
    return 0;
  }

  const completed = plan.actions.filter((action) => action.completed).length;
  return Math.round((completed / plan.actions.length) * 100);
}

export function isMitigationOverdue(
  action: RiskMitigationAction,
  now: Date = new Date(),
): boolean {
  return !action.completed && new Date(action.dueDate).getTime() < now.getTime();
}