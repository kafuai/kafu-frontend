export type EntitlementAssignmentTarget =
  | "tenant"
  | "workspace"
  | "user"
  | "team";

export interface EntitlementAssignment {
  id: string;
  entitlementId: string;
  targetType: EntitlementAssignmentTarget;
  targetId: string;
  assignedAt: Date;
  assignedBy: string;
}

export function createEntitlementAssignment(
  assignment: EntitlementAssignment,
): EntitlementAssignment {
  return assignment;
}