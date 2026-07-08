import type { FPAAuditEntry, FPAStatus } from "./fpaTypes";

export interface FPAGovernancePolicy {
  id: string;
  name: string;
  owner: string;
  status: FPAStatus;
  auditTrail: FPAAuditEntry[];
}

export function latestAuditEntry(policy: FPAGovernancePolicy): FPAAuditEntry | undefined {
  return policy.auditTrail.at(-1);
}
