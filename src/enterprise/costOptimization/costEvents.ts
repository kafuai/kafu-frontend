import { CostSeverity } from "./costTypes";

export type CostEventType =
  | "cost.analyzed"
  | "cost.allocated"
  | "budget.warning"
  | "budget.critical"
  | "budget.exceeded"
  | "optimization.recommended"
  | "optimization.completed";

export type CostEvent = {
  id: string;
  organizationId: string;
  type: CostEventType;
  severity: CostSeverity;
  message: string;
  metadata?: Record<string, unknown>;
  createdAt: Date;
};

export function createCostEvent(input: {
  id: string;
  organizationId: string;
  type: CostEventType;
  severity?: CostSeverity;
  message: string;
  metadata?: Record<string, unknown>;
}): CostEvent {
  return {
    id: input.id,
    organizationId: input.organizationId,
    type: input.type,
    severity: input.severity ?? "medium",
    message: input.message,
    metadata: input.metadata,
    createdAt: new Date(),
  };
}