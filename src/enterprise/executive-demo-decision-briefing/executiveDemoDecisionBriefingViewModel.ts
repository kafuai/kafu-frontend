import {
  ExecutiveDecisionBriefing,
} from "./executiveDemoDecisionBriefingTypes";
import {
  summarizeExecutiveDecisionBriefing,
} from "./executiveDemoDecisionBriefingSummary";

export interface ExecutiveDecisionBriefingViewMetric {
  label: string;
  value: string;
  supportingText?: string;
}

export interface ExecutiveDecisionBriefingViewSection {
  id: string;
  title: string;
  content: string[];
}

export interface ExecutiveDecisionBriefingViewModel {
  id: string;
  companyName: string;
  heading: string;
  subheading: string;
  statusLabel: string;
  priorityLabel: string;
  confidenceLabel: string;
  decisionRequired: string;
  recommendedDecision: string;
  executiveSummary: string;
  rationale: string;
  impactAreas: string[];
  metrics: ExecutiveDecisionBriefingViewMetric[];
  sections: ExecutiveDecisionBriefingViewSection[];
  footerSummary: string;
}

export function buildExecutiveDecisionBriefingViewModel(
  briefing: ExecutiveDecisionBriefing,
): ExecutiveDecisionBriefingViewModel {
  const summary = summarizeExecutiveDecisionBriefing(briefing);

  return {
    id: briefing.id,
    companyName: briefing.companyName,
    heading: briefing.title,
    subheading: "Executive decision intelligence and recommended action",
    statusLabel: briefing.status.replace(/-/g, " "),
    priorityLabel: briefing.priority,
    confidenceLabel: briefing.confidence.replace(/-/g, " "),
    decisionRequired: briefing.decisionRequired,
    recommendedDecision: briefing.recommendedDecision,
    executiveSummary: briefing.executiveSummary,
    rationale: briefing.rationale,
    impactAreas: briefing.impactAreas.map((area) =>
      area.replace(/-/g, " "),
    ),
    metrics: briefing.keyMetrics.map((metric) => ({
      label: metric.label,
      value: metric.value,
      supportingText: metric.description,
    })),
    sections: [
      {
        id: "evidence",
        title: "Supporting Evidence",
        content: briefing.evidence.map(
          (item) => `${item.title}: ${item.summary}`,
        ),
      },
      {
        id: "risks",
        title: "Decision Risks",
        content: briefing.risks.map(
          (risk) => `${risk.title}: ${risk.description}`,
        ),
      },
      {
        id: "options",
        title: "Decision Options",
        content: briefing.options.map(
          (option) =>
            `${option.title}: ${option.summary}${
              option.recommended ? " — Recommended" : ""
            }`,
        ),
      },
      {
        id: "actions",
        title: "Next Actions",
        content: briefing.actions.map(
          (action) => `${action.title}: ${action.description}`,
        ),
      },
    ],
    footerSummary:
      `${summary.readinessSummary} ` +
      `${summary.actionCount} actions and ${summary.optionCount} options are defined.`,
  };
}
