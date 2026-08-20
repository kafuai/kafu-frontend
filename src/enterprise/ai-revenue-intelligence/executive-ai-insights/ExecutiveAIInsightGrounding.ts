import type {
  GroundedAIEvidence,
  GroundedAIResult,
  GroundedAIService,
} from "../../ai/grounded-ai";

import type {
  ExecutiveAIInsightBriefing,
  ExecutiveAIInsightContext,
} from "./ExecutiveAIInsightTypes";

interface GroundedExecutiveSummary {
  headline: string;
  narrative: string;
  primaryStrength?: string;
  primaryRisk?: string;
  primaryDecision?: string;
}

interface GroundedExecutiveInsight {
  index: number;
  headline: string;
  narrative: string;
  businessImpact: string;
  recommendedAction?: string;
}

interface GroundedExecutiveRecommendation {
  index: number;
  title: string;
  description: string;
  rationale: string;
  expectedImpact: string;
}

interface GroundedExecutivePayload {
  summary: GroundedExecutiveSummary;
  insights: GroundedExecutiveInsight[];
  recommendations: GroundedExecutiveRecommendation[];
}

export interface ExecutiveAIInsightGroundingDependencies {
  groundedAI: GroundedAIService;
}

export interface ExecutiveAIInsightGroundingInput {
  briefing: ExecutiveAIInsightBriefing;
  context: ExecutiveAIInsightContext;
  requestedBy?: string;
  correlationId?: string;
}

export interface ExecutiveAIInsightGroundingResult {
  briefing: ExecutiveAIInsightBriefing;
  provider: GroundedAIResult["provider"];
  model: string;
  responseId?: string;
  citationCount: number;
  evidenceCount: number;
  generatedAt: string;
  usage?: GroundedAIResult["usage"];
}

export class ExecutiveAIInsightGrounding {
  private readonly groundedAI: GroundedAIService;

  constructor(
    dependencies: ExecutiveAIInsightGroundingDependencies,
  ) {
    this.groundedAI = dependencies.groundedAI;
  }

  async ground(
    input: ExecutiveAIInsightGroundingInput,
  ): Promise<ExecutiveAIInsightGroundingResult> {
    const evidence =
      this.buildEvidence(
        input.briefing,
      );

    const result =
      await this.groundedAI.generate({
        task:
          "Transform the deterministic KAFU AI executive revenue intelligence briefing into grounded, executive-quality narrative and recommendations. Preserve every deterministic score, severity, priority, amount, percentage, status, category, action type, and business fact exactly as supplied.",

        question:
          "Return the grounded executive briefing content for the supplied deterministic intelligence.",

        evidence,

        context: {
          tenantId:
            input.context.tenantId,

          workspaceId:
            input.context.workspaceId,

          userId:
            input.requestedBy,

          metadata: {
            periodStart:
              input.context.periodStart,

            periodEnd:
              input.context.periodEnd,

            executiveScore:
              input.briefing.executiveScore,

            executiveStatus:
              input.briefing.summary
                .executiveStatus,
          },
        },

        correlationId:
          input.correlationId,

        instructions: `
Return STRICT JSON only.

Required schema:

{
  "summary": {
    "headline": "string",
    "narrative": "string",
    "primaryStrength": "string optional",
    "primaryRisk": "string optional",
    "primaryDecision": "string optional"
  },
  "insights": [
    {
      "index": 0,
      "headline": "string",
      "narrative": "string",
      "businessImpact": "string",
      "recommendedAction": "string optional"
    }
  ],
  "recommendations": [
    {
      "index": 0,
      "title": "string",
      "description": "string",
      "rationale": "string",
      "expectedImpact": "string"
    }
  ]
}

Rules:

1. Produce exactly one insight entry for every supplied deterministic insight.
2. Produce exactly one recommendation entry for every supplied deterministic recommendation.
3. Use the original zero-based indexes.
4. Do not add, remove, merge, reorder, or invent insights or recommendations.
5. Do not change deterministic scores, severity, priority, status, audience, categories, amounts, percentages, opportunity identifiers, action types, or calculated metrics.
6. Improve only human-facing narrative and recommendation language.
7. Every material factual claim must reference relevant evidence IDs in square brackets.
8. Do not use markdown fences.
9. Do not include text before or after the JSON object.
        `.trim(),
      });

    const payload =
      this.parsePayload(
        result.text,
        input.briefing,
      );

    return {
      briefing:
        this.mergeGroundedPayload(
          input.briefing,
          payload,
          result,
        ),

      provider:
        result.provider,

      model:
        result.model,

      responseId:
        result.responseId,

      citationCount:
        result.citations.length,

      evidenceCount:
        result.evidenceCount,

      generatedAt:
        result.generatedAt,

      usage:
        result.usage,
    };
  }

  private buildEvidence(
    briefing: ExecutiveAIInsightBriefing,
  ): readonly GroundedAIEvidence[] {
    const evidence:
      GroundedAIEvidence[] = [
        {
          id: "EXECUTIVE-SNAPSHOT",
          source:
            "executive-ai-insights",
          label:
            "Executive intelligence snapshot",
          value: {
            executiveScore:
              briefing.executiveScore,

            executiveStatus:
              briefing.summary
                .executiveStatus,

            trend:
              briefing.trend,

            trendPercentage:
              briefing.trendPercentage,

            criticalInsightCount:
              briefing.criticalInsightCount,

            highInsightCount:
              briefing.highInsightCount,

            managementAttentionRequired:
              briefing.managementAttentionRequired,

            periodStart:
              briefing.periodStart,

            periodEnd:
              briefing.periodEnd,
          },
          observedAt:
            briefing.generatedAt,
        },
      ];

    briefing.insights.forEach(
      (insight, index) => {
        evidence.push({
          id: `INSIGHT-${index + 1}`,
          source:
            "executive-ai-insights",
          label:
            `Deterministic insight ${index + 1}: ${insight.title}`,
          value: {
            index,

            category:
              insight.category,

            severity:
              insight.severity,

            priority:
              insight.priority,

            audience:
              insight.audience,

            title:
              insight.title,

            headline:
              insight.headline,

            narrative:
              insight.narrative,

            businessImpact:
              insight.businessImpact,

            recommendedAction:
              insight.recommendedAction,

            confidenceScore:
              insight.confidenceScore,

            amount:
              insight.amount,

            percentage:
              insight.percentage,

            opportunityIds:
              insight.opportunityIds
              ? [...insight.opportunityIds]
              : undefined,

            evidence:
              [...insight.evidence],
          },

          confidence:
            this.normalizeConfidence(
              insight.confidenceScore,
            ),

          observedAt:
            insight.generatedAt,
        });
      },
    );

    briefing.recommendations.forEach(
      (recommendation, index) => {
        evidence.push({
          id:
            `RECOMMENDATION-${index + 1}`,

          source:
            "executive-ai-insights",

          label:
            `Deterministic recommendation ${index + 1}: ${recommendation.title}`,

          value: {
            index,

            priority:
              recommendation.priority,

            audience:
              recommendation.audience,

            title:
              recommendation.title,

            description:
              recommendation.description,

            rationale:
              recommendation.rationale,

            expectedImpact:
              recommendation.expectedImpact,

            actionType:
              recommendation.actionType,

            opportunityIds:
              recommendation.opportunityIds
              ? [...recommendation.opportunityIds]
              : undefined,
          },

          observedAt:
            briefing.generatedAt,
        });
      },
    );

    return evidence;
  }

  private parsePayload(
    text: string,
    briefing: ExecutiveAIInsightBriefing,
  ): GroundedExecutivePayload {
    const normalized =
      this.normalizeJsonText(text);

    let parsed: unknown;

    try {
      parsed =
        JSON.parse(normalized);
    } catch {
      throw new Error(
        "Grounded executive intelligence returned invalid JSON.",
      );
    }

    if (
      !parsed
      || typeof parsed !== "object"
      || Array.isArray(parsed)
    ) {
      throw new Error(
        "Grounded executive intelligence returned an invalid payload.",
      );
    }

    const candidate =
      parsed as Partial<GroundedExecutivePayload>;

    if (
      !candidate.summary
      || typeof candidate.summary
        !== "object"
      || Array.isArray(
        candidate.summary,
      )
    ) {
      throw new Error(
        "Grounded executive intelligence summary is missing.",
      );
    }

    if (
      !Array.isArray(
        candidate.insights,
      )
      || candidate.insights.length
        !== briefing.insights.length
    ) {
      throw new Error(
        "Grounded executive intelligence insight count does not match deterministic intelligence.",
      );
    }

    if (
      !Array.isArray(
        candidate.recommendations,
      )
      || candidate.recommendations.length
        !== briefing.recommendations.length
    ) {
      throw new Error(
        "Grounded executive intelligence recommendation count does not match deterministic intelligence.",
      );
    }

    const summary =
      this.validateSummary(
        candidate.summary,
      );

    const insights =
      candidate.insights.map(
        (
          insight,
          expectedIndex,
        ) =>
          this.validateInsight(
            insight,
            expectedIndex,
          ),
      );

    const recommendations =
      candidate.recommendations.map(
        (
          recommendation,
          expectedIndex,
        ) =>
          this.validateRecommendation(
            recommendation,
            expectedIndex,
          ),
      );

    return {
      summary,
      insights,
      recommendations,
    };
  }

  private validateSummary(
    value: unknown,
  ): GroundedExecutiveSummary {
    const summary =
      value as Partial<GroundedExecutiveSummary>;

    return {
      headline:
        this.requireText(
          summary.headline,
          "summary.headline",
        ),

      narrative:
        this.requireText(
          summary.narrative,
          "summary.narrative",
        ),

      primaryStrength:
        this.optionalText(
          summary.primaryStrength,
        ),

      primaryRisk:
        this.optionalText(
          summary.primaryRisk,
        ),

      primaryDecision:
        this.optionalText(
          summary.primaryDecision,
        ),
    };
  }

  private validateInsight(
    value: unknown,
    expectedIndex: number,
  ): GroundedExecutiveInsight {
    if (
      !value
      || typeof value !== "object"
      || Array.isArray(value)
    ) {
      throw new Error(
        `Grounded executive insight ${expectedIndex} is invalid.`,
      );
    }

    const insight =
      value as Partial<GroundedExecutiveInsight>;

    if (
      insight.index
      !== expectedIndex
    ) {
      throw new Error(
        `Grounded executive insight index ${String(insight.index)} does not match expected index ${expectedIndex}.`,
      );
    }

    return {
      index:
        expectedIndex,

      headline:
        this.requireText(
          insight.headline,
          `insights[${expectedIndex}].headline`,
        ),

      narrative:
        this.requireText(
          insight.narrative,
          `insights[${expectedIndex}].narrative`,
        ),

      businessImpact:
        this.requireText(
          insight.businessImpact,
          `insights[${expectedIndex}].businessImpact`,
        ),

      recommendedAction:
        this.optionalText(
          insight.recommendedAction,
        ),
    };
  }

  private validateRecommendation(
    value: unknown,
    expectedIndex: number,
  ): GroundedExecutiveRecommendation {
    if (
      !value
      || typeof value !== "object"
      || Array.isArray(value)
    ) {
      throw new Error(
        `Grounded executive recommendation ${expectedIndex} is invalid.`,
      );
    }

    const recommendation =
      value as Partial<GroundedExecutiveRecommendation>;

    if (
      recommendation.index
      !== expectedIndex
    ) {
      throw new Error(
        `Grounded executive recommendation index ${String(recommendation.index)} does not match expected index ${expectedIndex}.`,
      );
    }

    return {
      index:
        expectedIndex,

      title:
        this.requireText(
          recommendation.title,
          `recommendations[${expectedIndex}].title`,
        ),

      description:
        this.requireText(
          recommendation.description,
          `recommendations[${expectedIndex}].description`,
        ),

      rationale:
        this.requireText(
          recommendation.rationale,
          `recommendations[${expectedIndex}].rationale`,
        ),

      expectedImpact:
        this.requireText(
          recommendation.expectedImpact,
          `recommendations[${expectedIndex}].expectedImpact`,
        ),
    };
  }

  private mergeGroundedPayload(
    briefing: ExecutiveAIInsightBriefing,
    payload: GroundedExecutivePayload,
    result: GroundedAIResult,
  ): ExecutiveAIInsightBriefing {
    return {
      ...briefing,

      insights:
        briefing.insights.map(
          (insight, index) => {
            const grounded =
              payload.insights[index];

            return {
              ...insight,

              headline:
                grounded.headline,

              narrative:
                grounded.narrative,

              businessImpact:
                grounded.businessImpact,

              recommendedAction:
                grounded.recommendedAction
                ?? insight.recommendedAction,

              metadata: {
                ...insight.metadata,

                groundedAI: true,

                groundedEvidenceId:
                  `INSIGHT-${index + 1}`,
              },
            };
          },
        ),

      recommendations:
        briefing.recommendations.map(
          (
            recommendation,
            index,
          ) => {
            const grounded =
              payload
                .recommendations[index];

            return {
              ...recommendation,

              title:
                grounded.title,

              description:
                grounded.description,

              rationale:
                grounded.rationale,

              expectedImpact:
                grounded.expectedImpact,
            };
          },
        ),

      summary: {
        ...briefing.summary,

        headline:
          payload.summary.headline,

        narrative:
          payload.summary.narrative,

        primaryStrength:
          payload.summary.primaryStrength,

        primaryRisk:
          payload.summary.primaryRisk,

        primaryDecision:
          payload.summary.primaryDecision,
      },

      metadata: {
        ...briefing.metadata,

        groundedAI: {
          enabled: true,

          provider:
            result.provider,

          model:
            result.model,

          responseId:
            result.responseId,

          generatedAt:
            result.generatedAt,

          evidenceCount:
            result.evidenceCount,

          citationCount:
            result.citations.length,

          citations:
            result.citations.map(
              (citation) => ({
                evidenceId:
                  citation.evidenceId,

                source:
                  citation.source,

                label:
                  citation.label,
              }),
            ),

          usage:
            result.usage,
        },
      },
    };
  }

  private normalizeJsonText(
    value: string,
  ): string {
    const trimmed =
      value.trim();

    if (
      trimmed.startsWith("```")
      && trimmed.endsWith("```")
    ) {
      return trimmed
        .replace(
          /^```(?:json)?\s*/i,
          "",
        )
        .replace(
          /\s*```$/,
          "",
        )
        .trim();
    }

    return trimmed;
  }

  private requireText(
    value: unknown,
    field: string,
  ): string {
    if (
      typeof value !== "string"
      || !value.trim()
    ) {
      throw new Error(
        `Grounded executive intelligence field "${field}" is required.`,
      );
    }

    return value.trim();
  }

  private optionalText(
    value: unknown,
  ): string | undefined {
    if (
      typeof value !== "string"
    ) {
      return undefined;
    }

    const normalized =
      value.trim();

    return normalized
      || undefined;
  }

  private normalizeConfidence(
    value: number,
  ): number {
    if (
      !Number.isFinite(value)
    ) {
      return 0;
    }

    return Math.min(
      1,
      Math.max(
        0,
        value / 100,
      ),
    );
  }
}

export const createExecutiveAIInsightGrounding = (
  dependencies:
    ExecutiveAIInsightGroundingDependencies,
): ExecutiveAIInsightGrounding =>
  new ExecutiveAIInsightGrounding(
    dependencies,
  );
