import type {
  ExecutiveDemoIntelligenceAction,
} from "./executiveDemoIntelligenceActions";
import type {
  ExecutiveDemoIntelligenceDecision,
} from "./executiveDemoIntelligenceDecision";
import type {
  ExecutiveDemoIntelligenceNarrative,
} from "./executiveDemoIntelligenceNarrative";
import type {
  ExecutiveDemoIntelligenceConfidence,
  ExecutiveDemoIntelligenceInsight,
  ExecutiveDemoIntelligencePriority,
  ExecutiveDemoIntelligenceResult,
} from "./executiveDemoIntelligenceTypes";

export interface ExecutiveDemoIntelligenceInsightViewModel {
  id: string;
  title: string;
  summary: string;
  priorityLabel: string;
  confidenceLabel: string;
  recommendedAction?: string;
}

export interface ExecutiveDemoIntelligenceActionViewModel {
  id: string;
  title: string;
  description: string;
  ownerRole: string;
  statusLabel: string;
  priorityLabel: string;
}

export interface ExecutiveDemoIntelligenceViewModel {
  headline: string;
  executiveSummary: string;
  confidence: ExecutiveDemoIntelligenceConfidence;
  confidenceLabel: string;
  decision: ExecutiveDemoIntelligenceDecision;
  narrative: ExecutiveDemoIntelligenceNarrative;
  insights: ExecutiveDemoIntelligenceInsightViewModel[];
  actions: ExecutiveDemoIntelligenceActionViewModel[];
  generatedAt: string;
}

export function buildExecutiveDemoIntelligenceViewModel(
  result: ExecutiveDemoIntelligenceResult,
  decision: ExecutiveDemoIntelligenceDecision,
  narrative: ExecutiveDemoIntelligenceNarrative,
  actions: ExecutiveDemoIntelligenceAction[],
): ExecutiveDemoIntelligenceViewModel {
  return {
    headline: decision.title,
    executiveSummary: result.executiveSummary,
    confidence: result.confidence,
    confidenceLabel: formatConfidence(result.confidence),
    decision,
    narrative,
    insights: result.insights.map(buildInsightViewModel),
    actions: actions.map((action) => ({
      id: action.id,
      title: action.title,
      description: action.description,
      ownerRole: action.ownerRole,
      statusLabel: formatStatus(action.status),
      priorityLabel: formatPriority(action.priority),
    })),
    generatedAt: result.generatedAt,
  };
}

function buildInsightViewModel(
  insight: ExecutiveDemoIntelligenceInsight,
): ExecutiveDemoIntelligenceInsightViewModel {
  return {
    id: insight.id,
    title: insight.title,
    summary: insight.summary,
    priorityLabel: formatPriority(insight.priority),
    confidenceLabel: formatConfidence(insight.confidence),
    recommendedAction: insight.recommendedAction,
  };
}

function formatPriority(
  priority: ExecutiveDemoIntelligencePriority,
): string {
  switch (priority) {
    case "critical":
      return "Critical";
    case "high":
      return "High";
    case "medium":
      return "Medium";
    case "low":
      return "Low";
  }
}

function formatConfidence(
  confidence: ExecutiveDemoIntelligenceConfidence,
): string {
  switch (confidence) {
    case "high":
      return "High confidence";
    case "medium":
      return "Medium confidence";
    case "low":
      return "Low confidence";
  }
}

function formatStatus(status: string): string {
  return status
    .split("-")
    .map(
      (word) =>
        word.charAt(0).toUpperCase() + word.slice(1),
    )
    .join(" ");
}
