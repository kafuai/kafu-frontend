import type { IdentityAuditMetadata } from "./identityAccessManagementTypes";

export interface Group extends IdentityAuditMetadata {
  id: string;
  name: string;
  description?: string;
  members: string[];
  roles: string[];
}

export const createGroup = (group: Group): Group => group;

export const addGroupMember = (
  group: Group,
  userId: string
): Group => ({
  ...group,
  members: [...group.members, userId],
});

export const groupMemberCount = (group: Group): number =>
  group.members.length;
