import {
  SalesEvent,
  SalesRiskLevel,
} from "./salesManagementTypes";

export function createSalesEvent(input: {
  id: string;
  type: string;
  title: string;
  description: string;
  severity?: SalesRiskLevel;
  createdAt?: string;
  metadata?: Record<string, unknown>;
}): SalesEvent {
  return {
    id: input.id,
    type: input.type,
    title: input.title,
    description: input.description,
    severity: input.severity ?? "low",
    createdAt: input.createdAt ?? new Date().toISOString(),
    metadata: input.metadata,
  };
}

export function createSalesRiskEvent(input: {
  id: string;
  title: string;
  description: string;
  severity: SalesRiskLevel;
  metadata?: Record<string, unknown>;
}): SalesEvent {
  return createSalesEvent({
    id: input.id,
    type: "sales_risk",
    title: input.title,
    description: input.description,
    severity: input.severity,
    metadata: input.metadata,
  });
}