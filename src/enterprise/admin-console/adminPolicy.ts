import { AdminAccessLevel } from "./adminConsoleTypes";

export interface AdminPolicy {
  id: string;
  name: string;
  requiredAccessLevel: AdminAccessLevel;
  enabled: boolean;
}

export function isAdminPolicyEnabled(policy: AdminPolicy): boolean {
  return policy.enabled;
}
