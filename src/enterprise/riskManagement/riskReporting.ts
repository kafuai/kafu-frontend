import { EnterpriseRiskRegisterEntry } from "./riskRegister";
import { calculateEnterpriseRiskMetrics } from "./riskMetrics";
import {
  createEnterpriseRiskDashboard,
  EnterpriseRiskDashboard,
} from "./riskDashboard";

export function generateEnterpriseRiskReport(
  risks: EnterpriseRiskRegisterEntry[],
): EnterpriseRiskDashboard {
  const metrics = calculateEnterpriseRiskMetrics(risks);
  return createEnterpriseRiskDashboard(metrics);
}