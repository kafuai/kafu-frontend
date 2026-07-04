import { ComplianceMetadata } from "./complianceTypes";

export type ComplianceAuditAction =
  | "created"
  | "updated"
  | "deleted"
  | "reviewed"
  | "approved"
  | "rejected"
  | "assessed";

export interface ComplianceAuditEntry {
  id: string;
  entityType: string;
  entityId: string;
  action: ComplianceAuditAction;
  actor: string;
  timestamp: string;
  details?: Record<string, unknown>;
}

export interface ComplianceAuditTrail {
  entries: ComplianceAuditEntry[];
  metadata: ComplianceMetadata;
}

export function appendComplianceAuditEntry(
  trail: ComplianceAuditTrail,
  entry: ComplianceAuditEntry,
): ComplianceAuditTrail {
  return {
    ...trail,
    entries: [...trail.entries, entry],
    metadata: {
      ...trail.metadata,
      updatedAt: new Date().toISOString(),
    },
  };
}