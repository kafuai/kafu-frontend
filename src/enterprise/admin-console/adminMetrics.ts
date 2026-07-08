export interface AdminMetrics {
  totalUsers: number;
  activeSessions: number;
  failedLogins: number;
  generatedAt: Date;
}

export function createAdminMetrics(): AdminMetrics {
  return {
    totalUsers: 0,
    activeSessions: 0,
    failedLogins: 0,
    generatedAt: new Date(),
  };
}
