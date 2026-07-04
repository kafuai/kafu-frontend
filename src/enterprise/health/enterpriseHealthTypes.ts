export type EnterpriseHealthStatus = "healthy" | "degraded" | "unhealthy";

export type EnterpriseHealthCheckResult = {
  name: string;
  status: EnterpriseHealthStatus;
  checkedAt: string;
  details?: string;
};

export type EnterpriseHealthCheck = {
  name: string;
  check: () => Promise<EnterpriseHealthCheckResult>;
};