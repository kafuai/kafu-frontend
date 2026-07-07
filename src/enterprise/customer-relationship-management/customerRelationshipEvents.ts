import {
  CustomerRelationshipEvent,
  CustomerRelationshipRiskLevel,
} from "./customerRelationshipManagementTypes";

export function createCustomerRelationshipEvent(input: {
  id: string;
  type: string;
  title: string;
  description: string;
  severity?: CustomerRelationshipRiskLevel;
  createdAt?: string;
  metadata?: Record<string, unknown>;
}): CustomerRelationshipEvent {
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

export function createCustomerRelationshipRiskEvent(input: {
  id: string;
  title: string;
  description: string;
  severity: CustomerRelationshipRiskLevel;
  metadata?: Record<string, unknown>;
}): CustomerRelationshipEvent {
  return createCustomerRelationshipEvent({
    id: input.id,
    type: "customer_relationship_risk",
    title: input.title,
    description: input.description,
    severity: input.severity,
    metadata: input.metadata,
  });
}