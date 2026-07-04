import { AIOptimizationMetricSnapshot } from "./aiOptimizationTypes";

export interface AIModelCandidate {
  id: string;
  provider: string;
  name: string;
  capabilityScore: number;
  averageLatencyMs: number;
  averageCostUsd: number;
  contextWindowTokens: number;
  safetyScore: number;
  reliabilityScore: number;
}

export interface AIModelOptimizationInput {
  organizationId: string;
  workloadName: string;
  currentModelId: string;
  candidates: AIModelCandidate[];
  requiredContextTokens: number;
  minimumCapabilityScore: number;
  minimumSafetyScore: number;
  currentMetrics?: AIOptimizationMetricSnapshot;
}

export interface AIModelOptimizationResult {
  organizationId: string;
  workloadName: string;
  selectedModel: AIModelCandidate | null;
  reason: string;
  rankedCandidates: AIModelCandidate[];
  createdAt: Date;
}

export function optimizeAIModelSelection(
  input: AIModelOptimizationInput,
): AIModelOptimizationResult {
  const eligibleCandidates = input.candidates.filter(
    (candidate) =>
      candidate.contextWindowTokens >= input.requiredContextTokens &&
      candidate.capabilityScore >= input.minimumCapabilityScore &&
      candidate.safetyScore >= input.minimumSafetyScore,
  );

  const rankedCandidates = [...eligibleCandidates].sort(
    (a, b) => scoreModelCandidate(b) - scoreModelCandidate(a),
  );

  const selectedModel = rankedCandidates[0] ?? null;

  return {
    organizationId: input.organizationId,
    workloadName: input.workloadName,
    selectedModel,
    reason: selectedModel
      ? `Selected ${selectedModel.name} based on capability, safety, reliability, cost, and latency balance.`
      : "No eligible model matched the required capability, safety, and context constraints.",
    rankedCandidates,
    createdAt: new Date(),
  };
}

function scoreModelCandidate(candidate: AIModelCandidate): number {
  const capability = candidate.capabilityScore * 0.35;
  const safety = candidate.safetyScore * 0.25;
  const reliability = candidate.reliabilityScore * 0.2;
  const latency = Math.max(0, 1 - candidate.averageLatencyMs / 10000) * 0.1;
  const cost = Math.max(0, 1 - candidate.averageCostUsd / 0.1) * 0.1;

  return capability + safety + reliability + latency + cost;
}