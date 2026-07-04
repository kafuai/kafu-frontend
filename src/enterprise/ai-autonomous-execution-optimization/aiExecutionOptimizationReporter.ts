import { AIExecutionOptimizationPlan } from "./aiExecutionOptimizationPlan";

export interface AIExecutionOptimizationReportSummary {
  totalItems: number;
  criticalItems: number;
  highItems: number;
  mediumItems: number;
  lowItems: number;
}

export interface AIExecutionOptimizationReport {
  planId: string;
  generatedAt: Date;
  generatedBy: string;
  summary: AIExecutionOptimizationReportSummary;
  recommendations: {
    opportunityId: string;
    priority: string;
    sequence: number;
    actions: string[];
    expectedBenefits: string[];
  }[];
}

export function createAIExecutionOptimizationReport(
  plan: AIExecutionOptimizationPlan,
  generatedBy: string,
): AIExecutionOptimizationReport {
  return {
    planId: plan.id,
    generatedAt: new Date(),
    generatedBy,
    summary: {
      totalItems: plan.items.length,
      criticalItems: countPriority(plan, "critical"),
      highItems: countPriority(plan, "high"),
      mediumItems: countPriority(plan, "medium"),
      lowItems: countPriority(plan, "low"),
    },
    recommendations: plan.items.map((item) => ({
      opportunityId: item.opportunityId,
      priority: item.priority,
      sequence: item.sequence,
      actions: item.actions,
      expectedBenefits: item.expectedBenefits,
    })),
  };
}

function countPriority(
  plan: AIExecutionOptimizationPlan,
  priority: "critical" | "high" | "medium" | "low",
): number {
  return plan.items.filter((item) => item.priority === priority).length;
}