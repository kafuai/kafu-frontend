import {
  buildExecutiveDemoAnalyticsScorecard,
  type ExecutiveDemoAnalyticsScorecard,
} from "./executiveDemoAnalyticsScorecard";
import {
  generateExecutiveDemoAnalyticsInsights,
  getCriticalExecutiveDemoAnalyticsInsights,
  type ExecutiveDemoAnalyticsInsight,
} from "./executiveDemoAnalyticsInsights";
import type {
  ExecutiveDemoAnalyticsSnapshot,
} from "./executiveDemoAnalyticsTypes";

export interface ExecutiveDemoAnalyticsReport {
  organizationId: string;
  sessionId: string;
  generatedAt: string;
  headline: string;
  executiveSummary: string;
  scorecard: ExecutiveDemoAnalyticsScorecard;
  insights: ExecutiveDemoAnalyticsInsight[];
  priorityInsights: ExecutiveDemoAnalyticsInsight[];
}

function buildExecutiveSummary(
  scorecard: ExecutiveDemoAnalyticsScorecard,
): string {
  if (scorecard.overallStatus === "healthy") {
    return `The executive demo analytics indicate strong overall performance with an aggregate score of ${scorecard.overallScore}/100.`;
  }

  if (scorecard.overallStatus === "attention") {
    return `The executive demo analytics show moderate readiness with an aggregate score of ${scorecard.overallScore}/100 and several areas requiring attention.`;
  }

  if (scorecard.overallStatus === "critical") {
    return `The executive demo analytics reveal material readiness gaps with an aggregate score of ${scorecard.overallScore}/100.`;
  }

  return "The executive demo analytics do not yet contain enough measurable data to produce a reliable conclusion.";
}

export function buildExecutiveDemoAnalyticsReport(
  snapshot: ExecutiveDemoAnalyticsSnapshot,
): ExecutiveDemoAnalyticsReport {
  const scorecard =
    buildExecutiveDemoAnalyticsScorecard(snapshot);

  const insights =
    generateExecutiveDemoAnalyticsInsights(snapshot);

  const priorityInsights =
    getCriticalExecutiveDemoAnalyticsInsights(insights);

  return {
    organizationId: snapshot.organizationId,
    sessionId: snapshot.sessionId,
    generatedAt: snapshot.generatedAt,
    headline: `Executive Demo Analytics Score: ${scorecard.overallScore}/100`,
    executiveSummary: buildExecutiveSummary(scorecard),
    scorecard,
    insights,
    priorityInsights,
  };
}
