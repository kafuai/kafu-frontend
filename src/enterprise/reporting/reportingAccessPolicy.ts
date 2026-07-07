export interface ReportingAccessPolicy {
  reportId: string;
  allowedRoles: string[];
  allowedUsers: string[];
}

export function canAccessReport(
  policy: ReportingAccessPolicy,
  userId: string,
  roles: string[],
): boolean {
  return policy.allowedUsers.includes(userId) ||
    roles.some((role) => policy.allowedRoles.includes(role));
}
