import type {
  ExecutiveDemoIntelligenceContext,
  ExecutiveDemoIntelligenceInsight,
  ExecutiveDemoIntelligenceSignal,
} from "./executiveDemoIntelligenceTypes";

export interface ExecutiveDemoIntelligenceRecommendation {
  title: string;
  summary: string;
  action: string;
  expectedOutcome: string;
  supportingInsightIds: string[];
}

export function buildExecutiveDemoIntelligenceRecommendation(
  context: ExecutiveDemoIntelligenceContext,
  insights: ExecutiveDemoIntelligenceInsight[],
  signals: ExecutiveDemoIntelligenceSignal[],
): ExecutiveDemoIntelligenceRecommendation {
  const primaryInsight = insights[0];

  if (primaryInsight) {
    return {
      title: primaryInsight.title,
      summary: primaryInsight.summary,
      action:
        primaryInsight.recommendedAction ??
        "Define an executive owner and initiate the recommended next step.",
      expectedOutcome:
        "A faster, evidence-based executive decision with clear accountability.",
      supportingInsightIds: insights.slice(0, 3).map((insight) => insight.id),
    };
  }

  const criticalSignal = signals.find(
    (signal) => signal.priority === "critical",
  );

  if (criticalSignal) {
    return {
      title: criticalSignal.title,
      summary: criticalSignal.description,
      action:
        "Escalate the issue to the executive owner and initiate immediate corrective action.",
      expectedOutcome:
        "Reduced enterprise risk and improved execution control.",
      supportingInsightIds: [],
    };
  }

  return {
    title: `Advance ${context.companyName}'s executive AI journey`,
    summary:
      "The available evidence supports progressing from demonstration to a focused enterprise action plan.",
    action:
      "Confirm the highest-value use case, executive sponsor and measurable pilot objective.",
    expectedOutcome:
      "A clear transition from executive interest to structured enterprise adoption.",
    supportingInsightIds: [],
  };
}

export function formatExecutiveDemoPrimaryRecommendation(
  recommendation: ExecutiveDemoIntelligenceRecommendation,
): string {
  return [
    recommendation.title,
    recommendation.summary,
    `Recommended action: ${recommendation.action}`,
    `Expected outcome: ${recommendation.expectedOutcome}`,
  ].join(" ");
}
