import { AIOptimizationMetricSnapshot } from "./aiOptimizationTypes";

export interface AIEvaluationFinding {
  id: string;
  evaluationId: string;
  dimension:
    | "accuracy"
    | "quality"
    | "safety"
    | "reliability"
    | "latency"
    | "cost"
    | "tokens"
    | "hallucination";
  score: number;
  threshold: number;
  description: string;
}

export interface AIEvaluationOptimizationResult {
  organizationId: string;
  failedFindings: AIEvaluationFinding[];
  optimizationFocus: AIEvaluationFinding["dimension"][];
  recommendedControls: string[];
  baselineMetrics: AIOptimizationMetricSnapshot;
  createdAt: Date;
}

export function optimizeFromAIEvaluation(
  organizationId: string,
  findings: AIEvaluationFinding[],
): AIEvaluationOptimizationResult {
  const failedFindings = findings.filter((finding) => finding.score < finding.threshold);

  const optimizationFocus = Array.from(
    new Set(failedFindings.map((finding) => finding.dimension)),
  );

  return {
    organizationId,
    failedFindings,
    optimizationFocus,
    recommendedControls: optimizationFocus.map(resolveEvaluationControl),
    baselineMetrics: mapFindingsToMetricSnapshot(findings),
    createdAt: new Date(),
  };
}

function resolveEvaluationControl(dimension: AIEvaluationFinding["dimension"]): string {
  switch (dimension) {
    case "accuracy":
      return "Add factual grounding and stricter response verification.";
    case "quality":
      return "Improve prompt structure, examples, and output standards.";
    case "safety":
      return "Add safety gate and policy-aware validation.";
    case "reliability":
      return "Add retries, fallback routes, and execution monitoring.";
    case "latency":
      return "Optimize model routing, caching, and parallel execution.";
    case "cost":
      return "Enable cache, smaller model routing, and request batching.";
    case "tokens":
      return "Compress context and remove redundant token segments.";
    case "hallucination":
      return "Add evaluation gate and source-grounded answer validation.";
    default:
      return "Review evaluation finding and create targeted optimization.";
  }
}

function mapFindingsToMetricSnapshot(
  findings: AIEvaluationFinding[],
): AIOptimizationMetricSnapshot {
  const snapshot: AIOptimizationMetricSnapshot = {};

  for (const finding of findings) {
    switch (finding.dimension) {
      case "accuracy":
        snapshot.accuracyScore = finding.score;
        break;
      case "quality":
        snapshot.qualityScore = finding.score;
        break;
      case "safety":
        snapshot.safetyScore = finding.score;
        break;
      case "reliability":
        snapshot.reliabilityScore = finding.score;
        break;
      case "latency":
        snapshot.averageLatencyMs = finding.score;
        break;
      case "cost":
        snapshot.averageCostUsd = finding.score;
        break;
      case "tokens":
        snapshot.averageTokensUsed = finding.score;
        break;
      case "hallucination":
        snapshot.hallucinationRate = finding.score;
        break;
    }
  }

  return snapshot;
}