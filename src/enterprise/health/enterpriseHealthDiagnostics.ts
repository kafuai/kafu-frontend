import { EnterpriseHealthMonitor } from "./enterpriseHealthMonitor";

export function getEnterpriseHealthDiagnostics(
  healthMonitor: EnterpriseHealthMonitor,
) {
  return {
    registeredCheckCount: healthMonitor.getRegisteredChecks().length,
    registeredChecks: healthMonitor.getRegisteredChecks(),
  };
}