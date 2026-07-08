import { EntitlementRecord } from "./entitlement";

export interface EntitlementEvaluationContext {
  tenantId: string;
  workspaceId?: string;
  userId?: string;
  featureKey?: string;
  quotaKey?: string;
}

export interface EntitlementEvaluationResult {
  allowed: boolean;
  reason: string;
  entitlementId?: string;
}

export function evaluateEntitlement(
  entitlement: EntitlementRecord,
  context: EntitlementEvaluationContext,
): EntitlementEvaluationResult {
  const isTenantMatch = entitlement.tenantId === context.tenantId;
  const isActive = entitlement.status === "active";

  return {
    allowed: isTenantMatch && isActive,
    reason: isTenantMatch && isActive ? "entitlement_allowed" : "entitlement_denied",
    entitlementId: entitlement.id,
  };
}