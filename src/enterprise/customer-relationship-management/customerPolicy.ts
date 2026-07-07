import { CustomerRelationshipPolicy } from "./customerRelationshipManagementTypes";

export function createCustomerRelationshipPolicy(input: {
  id: string;
  name: string;
  description: string;
  minimumHealthScore?: number;
  strategicAccountThreshold?: number;
  autoRiskDetectionEnabled?: boolean;
  status?: "active" | "inactive";
}): CustomerRelationshipPolicy {
  return {
    id: input.id,
    name: input.name,
    description: input.description,
    minimumHealthScore: clampScore(input.minimumHealthScore ?? 0.6),
    strategicAccountThreshold: Math.max(0, input.strategicAccountThreshold ?? 1_000_000),
    autoRiskDetectionEnabled: input.autoRiskDetectionEnabled ?? true,
    status: input.status ?? "active",
  };
}

export function isCustomerRelationshipPolicyActive(
  policy: CustomerRelationshipPolicy,
): boolean {
  return policy.status === "active";
}

function clampScore(score: number): number {
  return Math.max(0, Math.min(score, 1));
}