export interface TenantAnalytics {
  totalTenants: number;
  activeTenants: number;
  totalWorkspaces: number;
  activeWorkspaces: number;
}

export function calculateTenantActivityRate(
  analytics: TenantAnalytics,
): number {
  if (analytics.totalTenants === 0) return 0;

  return analytics.activeTenants / analytics.totalTenants;
}