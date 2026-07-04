import { ResilienceSeverity } from "./resilienceTypes";

export type ChaosExperimentType =
  | "latency"
  | "failure"
  | "resource-pressure"
  | "dependency-outage";

export type ChaosExperiment = {
  id: string;
  organizationId: string;
  name: string;
  type: ChaosExperimentType;
  severity: ResilienceSeverity;
  enabled: boolean;
  target: string;
  durationMs: number;
  metadata?: Record<string, unknown>;
};

export function createChaosExperiment(
  experiment: ChaosExperiment,
): ChaosExperiment {
  return experiment;
}

export function isChaosExperimentRunnable(
  experiment: ChaosExperiment,
): boolean {
  return experiment.enabled && experiment.durationMs > 0;
}