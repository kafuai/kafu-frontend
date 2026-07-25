import type {
  RevenueIntelligenceOpportunitySnapshot,
  RevenueIntelligenceResult,
} from "../../../src/enterprise/ai-revenue-intelligence/revenue-intelligence-orchestrator/RevenueIntelligenceTypes";
import type {
  ExecutiveInsight,
  ExecutiveInsightSource,
} from "../models/ExecutiveInsight";

export interface AiInsightsSelectorInput {
  workspaceId: string;

  pipelineResult:
    RevenueIntelligenceResult;

  forecastResult:
    RevenueIntelligenceResult;

  opportunityResults:
    readonly RevenueIntelligenceResult[];
}

function createInsight(
  input: {
    workspaceId: string;
    source: ExecutiveInsightSource;
    title: string;
    description: string;
    recommendation: string;
    confidence: number;
    createdAt: string;
    opportunityId?: string;
  },
): ExecutiveInsight {
  return {
    id: [
      "executive-insight",
      input.source,
      input.opportunityId
      ?? input.createdAt,
    ].join(":"),

    workspaceId:
      input.workspaceId,

    title:
      input.title,

    description:
      input.description,

    recommendation:
      input.recommendation,

    confidence:
      input.confidence,

    source:
      input.source,

    opportunityId:
      input.opportunityId,

    createdAt:
      new Date(
        input.createdAt,
      ),
  };
}

function selectOpportunityInsights(
  workspaceId: string,
  snapshot:
    RevenueIntelligenceOpportunitySnapshot,
): ExecutiveInsight[] {
  const insights:
    ExecutiveInsight[] = [];

  insights.push(
    createInsight({
      workspaceId,

      source:
        "opportunity-scoring",

      title:
        "Opportunity quality assessment",

      description:
        snapshot.opportunityScore
          .explanation
          .summary,

      recommendation:
        snapshot.opportunityScore
          .explanation
          .recommendedFocus[0]
        ?? "Continue monitoring the opportunity score and its primary drivers.",

      confidence:
        snapshot.opportunityScore
          .confidence,

      opportunityId:
        snapshot.opportunityId,

      createdAt:
        snapshot.opportunityScore
          .calculatedAt,
    }),
  );

  insights.push(
    createInsight({
      workspaceId,

      source:
        "win-probability",

      title:
        "Win probability outlook",

      description:
        snapshot.winProbability
          .explanation
          .summary,

      recommendation:
        snapshot.winProbability
          .explanation
          .recommendedActions[0]
        ?? "Review the primary probability drivers before the next sales action.",

      confidence:
        snapshot.winProbability
          .confidence,

      opportunityId:
        snapshot.opportunityId,

      createdAt:
        snapshot.winProbability
          .calculatedAt,
    }),
  );

  insights.push(
    createInsight({
      workspaceId,

      source:
        "revenue-prediction",

      title:
        "Predicted revenue contribution",

      description:
        snapshot.revenuePrediction
          .explanation
          .summary,

      recommendation:
        snapshot.revenuePrediction
          .explanation
          .recommendedActions[0]
        ?? "Protect the expected revenue by addressing the identified prediction risks.",

      confidence:
        snapshot.revenuePrediction
          .confidence,

      opportunityId:
        snapshot.opportunityId,

      createdAt:
        snapshot.revenuePrediction
          .calculatedAt,
    }),
  );

  if (
    snapshot.dealRisk
      .activeRiskCount > 0
  ) {
    insights.push(
      createInsight({
        workspaceId,

        source:
          "deal-risk",

        title:
          "Deal risk intelligence",

        description:
          snapshot.dealRisk
            .explanation
            .summary,

        recommendation:
          snapshot.dealRisk
            .explanation
            .recommendedActions[0]
          ?? "Review and mitigate the highest-ranked deal risk.",

        confidence:
          snapshot.dealRisk
            .confidence,

        opportunityId:
          snapshot.opportunityId,

        createdAt:
          snapshot.dealRisk
            .calculatedAt,
      }),
    );
  }

  const primaryRecommendation =
    snapshot.nextBestAction
      ?.primaryRecommendation;

  if (primaryRecommendation) {
    insights.push(
      createInsight({
        workspaceId,

        source:
          "next-best-action",

        title:
          primaryRecommendation.title,

        description:
          primaryRecommendation
            .description,

        recommendation:
          primaryRecommendation
            .expectedOutcome,

        confidence:
          primaryRecommendation
            .confidence,

        opportunityId:
          snapshot.opportunityId,

        createdAt:
          primaryRecommendation
            .recommendedAt,
      }),
    );
  }

  return insights;
}

export function selectAiInsights(
  input:
    AiInsightsSelectorInput,
): ExecutiveInsight[] {
  const insights:
    ExecutiveInsight[] = [];

  const pipeline =
    input.pipelineResult.pipelineSummary;

  if (pipeline) {
    insights.push(
      createInsight({
        workspaceId:
          input.workspaceId,

        source:
          "pipeline-health",

        title:
          "Pipeline health overview",

        description:
          `${pipeline.healthyCount} healthy, ${pipeline.watchCount} under watch, ${pipeline.atRiskCount} at risk, and ${pipeline.criticalCount} critical opportunities.`,

        recommendation:
          pipeline.immediateAttentionCount > 0
            ? `Prioritize the ${pipeline.immediateAttentionCount} opportunities requiring immediate attention.`
            : "Maintain execution cadence across the highest-value opportunities.",

        confidence:
          pipeline.averageConfidence,

        createdAt:
          pipeline.generatedAt,
      }),
    );
  }

  const salesForecast =
    input.forecastResult.salesForecast;

  if (salesForecast) {
    insights.push(
      createInsight({
        workspaceId:
          input.workspaceId,

        source:
          "sales-forecast",

        title:
          "Executive sales forecast",

        description:
          salesForecast.explanation
            .summary,

        recommendation:
          salesForecast.explanation
            .actions[0]
          ?? "Review forecast drivers and protect committed revenue.",

        confidence:
          salesForecast.confidence,

        createdAt:
          salesForecast.calculatedAt,
      }),
    );
  }

  for (
    const result
    of input.opportunityResults
  ) {
    if (!result.opportunitySnapshot) {
      continue;
    }

    insights.push(
      ...selectOpportunityInsights(
        input.workspaceId,
        result.opportunitySnapshot,
      ),
    );
  }

  return insights.sort(
    (left, right) =>
      right.confidence
      - left.confidence,
  );
}
