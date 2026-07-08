export interface AdminUser {
  id: string;
  tenantId: string;
  email: string;
  displayName: string;
  active: boolean;
  createdAt: Date;
}

export function isAdminUserActive(user: AdminUser): boolean {
  return user.active;
}
