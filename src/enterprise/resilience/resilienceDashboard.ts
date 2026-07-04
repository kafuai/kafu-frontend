import { ResiliencePolicy } from "./resilienceTypes";
import { ResilienceMetrics } from "./resilienceMetrics";
import {
  ResilienceReport,
  createResilienceReport,
} from "./resilienceReporter";

export type ResilienceDashboardSnapshot = {
  generatedAt: Date;
  totalPolicies: number;
  enabledPolicies: number;
  disabledPolicies: number;
  report: ResilienceReport;
};

export function createResilienceDashboardSnapshot(
  policies: ResiliencePolicy[],
  metrics: ResilienceMetrics,
): ResilienceDashboardSnapshot {
  const enabledPolicies = policies.filter((policy) => policy.enabled).length;

  return {
    generatedAt: new Date(),
    totalPolicies: policies.length,
    enabledPolicies,
    disabledPolicies: policies.length - enabledPolicies,
    report: createResilienceReport(metrics),
  };
}