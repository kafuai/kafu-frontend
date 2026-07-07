import {
  CustomerRelationship,
  CustomerRelationshipPriority,
  CustomerRelationshipRiskLevel,
  CustomerRelationshipStatus,
} from "./customerRelationshipManagementTypes";

export function createCustomerRelationship(input: {
  id: string;
  accountId: string;
  ownerId?: string;
  status?: CustomerRelationshipStatus;
  priority?: CustomerRelationshipPriority;
  healthScore?: number;
  riskLevel?: CustomerRelationshipRiskLevel;
  createdAt?: string;
  updatedAt?: string;
}): CustomerRelationship {
  const now = new Date().toISOString();

  return {
    id: input.id,
    accountId: input.accountId,
    ownerId: input.ownerId,
    status: input.status ?? "lead",
    priority: input.priority ?? "medium",
    healthScore: clampScore(input.healthScore ?? 0.6),
    riskLevel: input.riskLevel ?? "low",
    createdAt: input.createdAt ?? now,
    updatedAt: input.updatedAt ?? now,
  };
}

export function isCustomerRelationshipActive(
  relationship: CustomerRelationship,
): boolean {
  return relationship.status === "active";
}

function clampScore(score: number): number {
  return Math.max(0, Math.min(score, 1));
}