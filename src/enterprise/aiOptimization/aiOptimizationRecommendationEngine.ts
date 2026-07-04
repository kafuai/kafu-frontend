import { AIOptimizationObjective } from "./aiOptimizationObjective";
import {
  AIOptimizationRecommendation,
  createAIOptimizationRecommendation,
  calculateRecommendationScore,
} from "./aiOptimizationRecommendation";
import { AIOptimizationTarget } from "./aiOptimizationTarget";
import { AIOptimizationEvidence } from "./aiOptimizationTypes";

export interface GenerateAIOptimizationRecommendationsInput {
  organizationId: string;
  targets: AIOptimizationTarget[];
  objectives: AIOptimizationObjective[];
  generatedBy: string;
}

export function generateAIOptimizationRecommendations(
  input: GenerateAIOptimizationRecommendationsInput,
): AIOptimizationRecommendation[] {
  const recommendations: AIOptimizationRecommendation[] = [];

  for (const target of input.targets) {
    const metrics = target.currentMetrics;
    const evidence: AIOptimizationEvidence[] = [];

    if ((metrics.averageCostUsd ?? 0) > 0.05) {
      evidence.push({
        source: "metric_snapshot",
        description: "Average AI execution cost is above optimization threshold.",
        metric: "averageCostUsd",
        value: metrics.averageCostUsd,
        confidence: 0.82,
      });

      recommendations.push(
        createAIOptimizationRecommendation({
          id: `${target.id}-cost-cache`,
          organizationId: input.organizationId,
          targetId: target.id,
          targetType: target.type,
          action: "enable_cache",
          title: "Enable AI Response Cache",
          description:
            "Introduce cache-aware execution for repeated or semantically similar requests to reduce cost.",
          expectedImpact: {
            costReductionPercent: 15,
            latencyReductionPercent: 10,
            tokenReductionPercent: 8,
          },
          impactLevel: "high",
          effortLevel: "medium",
          riskLevel: "low",
          confidence: 0.82,
          trace: {
            createdAt: new Date(),
            createdBy: input.generatedBy,
            reason: "Cost optimization opportunity detected.",
            evidence,
          },
        }),
      );
    }

    if ((metrics.averageLatencyMs ?? 0) > 3000) {
      recommendations.push(
        createAIOptimizationRecommendation({
          id: `${target.id}-latency-routing`,
          organizationId: input.organizationId,
          targetId: target.id,
          targetType: target.type,
          action: "improve_routing",
          title: "Optimize AI Model Routing",
          description:
            "Route low-complexity requests to faster models while preserving higher-capability models for complex workloads.",
          expectedImpact: {
            latencyReductionPercent: 20,
            costReductionPercent: 10,
          },
          impactLevel: "high",
          effortLevel: "medium",
          riskLevel: "medium",
          confidence: 0.78,
          trace: {
            createdAt: new Date(),
            createdBy: input.generatedBy,
            reason: "Latency threshold exceeded.",
            evidence: [
              {
                source: "metric_snapshot",
                description: "Average latency is above enterprise target.",
                metric: "averageLatencyMs",
                value: metrics.averageLatencyMs,
                confidence: 0.78,
              },
            ],
          },
        }),
      );
    }

    if ((metrics.averageTokensUsed ?? 0) > 6000) {
      recommendations.push(
        createAIOptimizationRecommendation({
          id: `${target.id}-context-compression`,
          organizationId: input.organizationId,
          targetId: target.id,
          targetType: target.type,
          action: "compress_context",
          title: "Compress AI Context",
          description:
            "Reduce redundant context, summarize long memory blocks, and prioritize only decision-relevant context.",
          expectedImpact: {
            tokenReductionPercent: 25,
            costReductionPercent: 18,
            latencyReductionPercent: 12,
          },
          impactLevel: "high",
          effortLevel: "low",
          riskLevel: "low",
          confidence: 0.86,
          trace: {
            createdAt: new Date(),
            createdBy: input.generatedBy,
            reason: "Token usage is above efficient operating range.",
            evidence: [
              {
                source: "metric_snapshot",
                description: "Average token usage is high.",
                metric: "averageTokensUsed",
                value: metrics.averageTokensUsed,
                confidence: 0.86,
              },
            ],
          },
        }),
      );
    }

    if ((metrics.hallucinationRate ?? 0) > 0.05) {
      recommendations.push(
        createAIOptimizationRecommendation({
          id: `${target.id}-evaluation-gate`,
          organizationId: input.organizationId,
          targetId: target.id,
          targetType: target.type,
          action: "add_evaluation_gate",
          title: "Add Evaluation Validation Gate",
          description:
            "Require evaluation validation before AI responses are approved for sensitive or high-impact workflows.",
          expectedImpact: {
            hallucinationReductionPercent: 30,
            qualityIncreasePercent: 12,
            safetyIncreasePercent: 15,
          },
          impactLevel: "transformational",
          effortLevel: "medium",
          riskLevel: "low",
          confidence: 0.88,
          trace: {
            createdAt: new Date(),
            createdBy: input.generatedBy,
            reason: "Hallucination rate is above acceptable threshold.",
            evidence: [
              {
                source: "metric_snapshot",
                description: "Hallucination rate exceeded enterprise tolerance.",
                metric: "hallucinationRate",
                value: metrics.hallucinationRate,
                confidence: 0.88,
              },
            ],
          },
        }),
      );
    }
  }

  return recommendations.sort(
    (a, b) => calculateRecommendationScore(b) - calculateRecommendationScore(a),
  );
}