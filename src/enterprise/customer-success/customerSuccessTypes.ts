export type CustomerLifecycleStage =
  | "prospect"
  | "onboarding"
  | "active"
  | "growth"
  | "renewal"
  | "at_risk"
  | "churned";

export type CustomerHealth =
  | "excellent"
  | "good"
  | "fair"
  | "poor"
  | "critical";

export interface CustomerSuccessSummary {
  accountId: string;
  lifecycle: CustomerLifecycleStage;
  health: CustomerHealth;
  score: number;
  ownerId: string;
}