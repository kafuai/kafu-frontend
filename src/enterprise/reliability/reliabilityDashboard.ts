import { ReliabilityAssessment } from "./reliabilityTypes";
import {
  createReliabilityMetricsSnapshot,
  ReliabilityMetricsSnapshot,
} from "./reliabilityMetrics";

export type ReliabilityDashboard = {
  metrics: ReliabilityMetricsSnapshot;
  assessments: ReliabilityAssessment[];
  generatedAt: Date;
};

export function createReliabilityDashboard(
  assessments: ReliabilityAssessment[],
): ReliabilityDashboard {
  return {
    metrics: createReliabilityMetricsSnapshot(assessments),
    assessments,
    generatedAt: new Date(),
  };
}