import { AIOptimizationMetricSnapshot } from "./aiOptimizationTypes";

export interface AIQualityIssue {
  id: string;
  category:
    | "accuracy"
    | "completeness"
    | "clarity"
    | "consistency"
    | "safety"
    | "grounding"
    | "format";
  severity: "low" | "medium" | "high" | "critical";
  description: string;
  frequency: number;
}

export interface AIQualityOptimizationResult {
  organizationId: string;
  qualityScoreBefore?: number;
  prioritizedIssues: AIQualityIssue[];
  actions: Array<{
    issueId: string;
    action:
      | "add_examples"
      | "strengthen_instructions"
      | "add_grounding"
      | "add_safety_check"
      | "standardize_output_format"
      | "add_consistency_rule";
    reason: string;
  }>;
  createdAt: Date;
}

export function optimizeAIQuality(
  organizationId: string,
  issues: AIQualityIssue[],
  currentMetrics?: AIOptimizationMetricSnapshot,
): AIQualityOptimizationResult {
  const prioritizedIssues = [...issues].sort(
    (a, b) => scoreQualityIssue(b) - scoreQualityIssue(a),
  );

  const actions = prioritizedIssues.map((issue) => ({
    issueId: issue.id,
    action: resolveQualityAction(issue),
    reason: `Issue category ${issue.category} with severity ${issue.severity} requires targeted optimization.`,
  }));

  return {
    organizationId,
    qualityScoreBefore: currentMetrics?.qualityScore,
    prioritizedIssues,
    actions,
    createdAt: new Date(),
  };
}

function scoreQualityIssue(issue: AIQualityIssue): number {
  const severityWeight: Record<AIQualityIssue["severity"], number> = {
    low: 1,
    medium: 2,
    high: 3,
    critical: 4,
  };

  return severityWeight[issue.severity] * issue.frequency;
}

function resolveQualityAction(
  issue: AIQualityIssue,
): AIQualityOptimizationResult["actions"][number]["action"] {
  switch (issue.category) {
    case "accuracy":
    case "grounding":
      return "add_grounding";
    case "safety":
      return "add_safety_check";
    case "format":
      return "standardize_output_format";
    case "consistency":
      return "add_consistency_rule";
    case "clarity":
    case "completeness":
    default:
      return "strengthen_instructions";
  }
}