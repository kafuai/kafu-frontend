import { getEnterpriseHealth } from "./healthMonitor";
import { validateEnterpriseStartup } from "./startupValidation";

export function getEnterpriseDiagnostics() {
  const health = getEnterpriseHealth();
  const startup = validateEnterpriseStartup();

  return {
    status: health.status,
    health,
    startup,
    generatedAt: new Date().toISOString(),
  };
}