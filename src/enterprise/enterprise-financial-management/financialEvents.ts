export type FinancialEventType =
  | "budget_created"
  | "budget_allocated"
  | "expense_recorded"
  | "revenue_recorded"
  | "approval_requested"
  | "approval_completed"
  | "forecast_generated"
  | "risk_identified";

export interface FinancialEvent {
  id: string;
  type: FinancialEventType;
  entityId: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}