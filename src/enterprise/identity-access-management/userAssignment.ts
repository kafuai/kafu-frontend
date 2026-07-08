import type { IdentityAuditMetadata } from "./identityAccessManagementTypes";

export interface UserAssignment extends IdentityAuditMetadata {
  id: string;
  userId: string;
  roleIds: string[];
  groupIds: string[];
  expiresAt?: string;
}

export const createUserAssignment = (
  assignment: UserAssignment
): UserAssignment => assignment;

export const hasAssignedRole = (
  assignment: UserAssignment,
  roleId: string
): boolean => assignment.roleIds.includes(roleId);

export const hasAssignedGroup = (
  assignment: UserAssignment,
  groupId: string
): boolean => assignment.groupIds.includes(groupId);
