import { EntitlementRecord } from "./entitlement";

export interface EntitlementPolicy {
  id: string;
  name: string;
  enabled: boolean;
  evaluate(entitlement: EntitlementRecord): boolean;
}

export function evaluateEntitlementPolicy(
  policy: EntitlementPolicy,
  entitlement: EntitlementRecord,
): boolean {
  return policy.enabled && policy.evaluate(entitlement);
}