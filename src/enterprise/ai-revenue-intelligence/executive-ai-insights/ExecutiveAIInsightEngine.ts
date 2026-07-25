import {
  clampExecutiveAIInsightScore,
  resolveExecutiveAIInsightPriority,
  resolveExecutiveAIInsightTrend,
  roundExecutiveAIInsightNumber,
  severityWeight,
} from "./ExecutiveAIInsightRules";
import type {
  ExecutiveAIInsight,
  ExecutiveAIInsightBriefing,
  ExecutiveAIInsightConfiguration,
  ExecutiveAIInsightContext,
  ExecutiveAIInsightRecommendation,
  ExecutiveAIInsightSeverity,
  ExecutiveBoardHighlight,
  ExecutiveBriefingSummary,
} from "./ExecutiveAIInsightTypes";

const DEFAULT_CONFIGURATION:
  ExecutiveAIInsightConfiguration = {
    modelVersion: "5.0.0",
    briefingTtlHours: 12,

    maximumInsights: 16,
    maximumRecommendations: 12,
    maximumBoardHighlights: 8,

    criticalRevenueGapPercentage: 30,
    highRevenueGapPercentage: 15,

    criticalPipelineHealthScore: 40,
    highPipelineHealthScore: 55,

    materialForecastChangePercentage: 10,
    materialPipelineScoreChange: 10,
  };

export interface ExecutiveAIInsightEngineDependencies {
  configuration?:
    Partial<ExecutiveAIInsightConfiguration>;
}

interface DraftExecutiveInsight {
  category:
    ExecutiveAIInsight["category"];

  severity:
    ExecutiveAIInsightSeverity;

  audience:
    ExecutiveAIInsight["audience"];

  title: string;
  headline: string;
  narrative: string;

  businessImpact: string;
  recommendedAction?: string;

  confidenceScore: number;

  amount?: number;
  percentage?: number;

  opportunityIds?:
    readonly string[];

  evidence:
    readonly string[];

  metadata?:
    Readonly<Record<string, unknown>>;
}

export class ExecutiveAIInsightEngine {
  private readonly configuration:
    ExecutiveAIInsightConfiguration;

  constructor(
    dependencies:
      ExecutiveAIInsightEngineDependencies = {},
  ) {
    this.configuration = {
      ...DEFAULT_CONFIGURATION,
      ...dependencies.configuration,
    };
  }

  generate(
    context:
      ExecutiveAIInsightContext,
    generatedAt = new Date(),
    correlationId?: string,
  ): ExecutiveAIInsightBriefing {
    this.validateContext(context);

    const expiresAt =
      new Date(
        generatedAt.getTime()
        + (
          this.configuration
            .briefingTtlHours
          * 60
          * 60
          * 1000
        ),
      );

    const draftInsights = [
      ...this.buildRevenueInsights(
        context,
      ),

      ...this.buildPipelineInsights(
        context,
      ),

      ...this.buildOpportunityInsights(
        context,
      ),

      ...this.buildPerformanceInsights(
        context,
      ),

      ...this.buildRiskInsights(
        context,
      ),
    ];

    const insights =
      draftInsights
        .sort(
          (left, right) =>
            severityWeight[
              right.severity
            ]
            - severityWeight[
              left.severity
            ]
            || right.confidenceScore
            - left.confidenceScore,
        )
        .slice(
          0,
          this.configuration
            .maximumInsights,
        )
        .map(
          (
            insight,
            index,
          ): ExecutiveAIInsight => ({
            id: "",

            tenantId:
              context.tenantId,

            workspaceId:
              context.workspaceId,

            category:
              insight.category,

            severity:
              insight.severity,

            priority:
              resolveExecutiveAIInsightPriority(
                insight.severity,
              ),

            status: "new",

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
              roundExecutiveAIInsightNumber(
                clampExecutiveAIInsightScore(
                  insight.confidenceScore,
                ),
              ),

            amount:
              insight.amount,

            percentage:
              insight.percentage,

            opportunityIds:
              insight.opportunityIds,

            evidence:
              insight.evidence,

            generatedAt:
              generatedAt.toISOString(),

            expiresAt:
              expiresAt.toISOString(),

            modelVersion:
              this.configuration
                .modelVersion,

            correlationId,

            metadata: {
              ...insight.metadata,
              ranking: index + 1,
            },
          }),
        );

    const recommendations =
      this.buildRecommendations(
        context,
        insights,
      );

    const boardHighlights =
      this.buildBoardHighlights(
        context,
        insights,
      );

    const executiveScore =
      this.calculateExecutiveScore(
        context,
        insights,
      );

    const previousScore =
      this.resolvePreviousExecutiveScore(
        context,
      );

    const trend =
      resolveExecutiveAIInsightTrend(
        executiveScore,
        previousScore,
      );

    const summary =
      this.buildSummary(
        executiveScore,
        insights,
        recommendations,
      );

    const criticalInsightCount =
      insights.filter(
        (insight) =>
          insight.severity === "critical",
      ).length;

    const highInsightCount =
      insights.filter(
        (insight) =>
          insight.severity === "high",
      ).length;

    return {
      id: "",

      tenantId:
        context.tenantId,

      workspaceId:
        context.workspaceId,

      periodStart:
        context.periodStart,

      periodEnd:
        context.periodEnd,

      generatedAt:
        generatedAt.toISOString(),

      expiresAt:
        expiresAt.toISOString(),

      modelVersion:
        this.configuration.modelVersion,

      executiveScore,

      trend:
        trend.trend,

      trendPercentage:
        trend.percentage,

      insights,
      recommendations,
      boardHighlights,
      summary,

      criticalInsightCount,
      highInsightCount,

      managementAttentionRequired:
        criticalInsightCount > 0
        || highInsightCount >= 3
        || summary.executiveStatus
          === "intervention-required",

      metadata:
        context.metadata,
    };
  }

  private buildRevenueInsights(
    context:
      ExecutiveAIInsightContext,
  ): DraftExecutiveInsight[] {
    const revenue =
      context.revenue;

    if (!revenue) {
      return [];
    }

    const insights:
      DraftExecutiveInsight[] = [];

    const target =
      revenue.targetRevenue;

    const expected =
      revenue.expectedRevenue;

    if (
      target !== undefined
      && target > 0
      && expected !== undefined
    ) {
      const gap =
        Math.max(
          0,
          target - expected,
        );

      const gapPercentage =
        (
          gap / target
        ) * 100;

      if (
        gapPercentage
        >= this.configuration
          .criticalRevenueGapPercentage
      ) {
        insights.push({
          category: "revenue",
          severity: "critical",
          audience: "executive",

          title:
            "Revenue target is critically exposed",

          headline:
            `Expected revenue is ${roundExecutiveAIInsightNumber(gapPercentage)}% below target.`,

          narrative:
            `The current expected revenue of ${roundExecutiveAIInsightNumber(expected)} is materially below the target of ${roundExecutiveAIInsightNumber(target)}.`,

          businessImpact:
            "Without immediate recovery action, the organization is unlikely to achieve the active revenue target.",

          recommendedAction:
            "Launch an executive revenue recovery plan focused on committed deals, near-term pipeline creation, and forecast revalidation.",

          confidenceScore:
            revenue.forecastConfidenceScore
            ?? 75,

          amount:
            roundExecutiveAIInsightNumber(
              gap,
            ),

          percentage:
            roundExecutiveAIInsightNumber(
              gapPercentage,
            ),

          evidence: [
            `target-revenue:${target}`,
            `expected-revenue:${expected}`,
            `target-gap:${gap}`,
          ],
        });
      } else if (
        gapPercentage
        >= this.configuration
          .highRevenueGapPercentage
      ) {
        insights.push({
          category: "revenue",
          severity: "high",
          audience: "executive",

          title:
            "Revenue target requires corrective action",

          headline:
            `Expected revenue is ${roundExecutiveAIInsightNumber(gapPercentage)}% below target.`,

          narrative:
            "The current revenue forecast remains recoverable but requires active executive management.",

          businessImpact:
            "Target attainment remains at risk unless revenue timing and pipeline quality improve.",

          recommendedAction:
            "Prioritize high-confidence deals and establish weekly recovery checkpoints.",

          confidenceScore:
            revenue.forecastConfidenceScore
            ?? 70,

          amount:
            roundExecutiveAIInsightNumber(
              gap,
            ),

          percentage:
            roundExecutiveAIInsightNumber(
              gapPercentage,
            ),

          evidence: [
            `target-revenue:${target}`,
            `expected-revenue:${expected}`,
          ],
        });
      } else {
        insights.push({
          category: "revenue",
          severity: "informational",
          audience: "executive",

          title:
            "Revenue forecast is aligned with target",

          headline:
            "Expected revenue is within the acceptable target range.",

          narrative:
            `Expected revenue is ${roundExecutiveAIInsightNumber(expected)} against a target of ${roundExecutiveAIInsightNumber(target)}.`,

          businessImpact:
            "Current forecast conditions support the active revenue plan.",

          recommendedAction:
            "Maintain deal inspection discipline and protect committed revenue.",

          confidenceScore:
            revenue.forecastConfidenceScore
            ?? 70,

          percentage:
            revenue.targetAttainmentPercentage,

          evidence: [
            `target-revenue:${target}`,
            `expected-revenue:${expected}`,
          ],
        });
      }
    }

    if (
      revenue.previousExpectedRevenue
      !== undefined
      && revenue.previousExpectedRevenue
        !== 0
      && expected !== undefined
    ) {
      const change =
        (
          (
            expected
            - revenue.previousExpectedRevenue
          )
          / Math.abs(
            revenue.previousExpectedRevenue,
          )
        ) * 100;

      if (
        Math.abs(change)
        >= this.configuration
          .materialForecastChangePercentage
      ) {
        const declining =
          change < 0;

        insights.push({
          category: "forecast",

          severity:
            declining
              ? "high"
              : "medium",

          audience: "executive",

          title:
            declining
              ? "Revenue forecast declined materially"
              : "Revenue forecast improved materially",

          headline:
            `Expected revenue changed by ${roundExecutiveAIInsightNumber(change)}% versus the previous forecast.`,

          narrative:
            declining
              ? "The material forecast decline requires validation of deal timing, qualification, and close confidence."
              : "The forecast improvement indicates stronger opportunity progression or newly qualified pipeline.",

          businessImpact:
            declining
              ? "Revenue predictability and target attainment have weakened."
              : "Revenue outlook and target attainment potential have improved.",

          recommendedAction:
            declining
              ? "Review the opportunities responsible for the decline and establish recovery actions."
              : "Validate that forecast improvement is supported by customer evidence and confirmed milestones.",

          confidenceScore:
            revenue.forecastConfidenceScore
            ?? 70,

          percentage:
            roundExecutiveAIInsightNumber(
              change,
            ),

          evidence: [
            `previous-forecast:${revenue.previousExpectedRevenue}`,
            `current-forecast:${expected}`,
          ],
        });
      }
    }

    if (
      revenue.forecastConfidenceScore
      !== undefined
      && revenue.forecastConfidenceScore
        < 50
    ) {
      insights.push({
        category: "forecast",
        severity: "high",
        audience: "revenue-operations",

        title:
          "Forecast confidence is low",

        headline:
          `Forecast confidence is ${roundExecutiveAIInsightNumber(revenue.forecastConfidenceScore)}.`,

        narrative:
          "Forecast reliability is limited by weak data completeness, unstable opportunities, or insufficient historical evidence.",

        businessImpact:
          "Executive planning decisions may be based on a forecast with elevated uncertainty.",

        recommendedAction:
          "Revalidate close dates, opportunity probabilities, committed categories, and inactive opportunities.",

        confidenceScore: 90,

        percentage:
          revenue.forecastConfidenceScore,

        evidence: [
          `forecast-confidence:${revenue.forecastConfidenceScore}`,
        ],
      });
    }

    return insights;
  }

  private buildPipelineInsights(
    context:
      ExecutiveAIInsightContext,
  ): DraftExecutiveInsight[] {
    const pipeline =
      context.pipeline;

    if (!pipeline) {
      return [];
    }

    const insights:
      DraftExecutiveInsight[] = [];

    if (
      pipeline.healthScore
      !== undefined
    ) {
      if (
        pipeline.healthScore
        < this.configuration
          .criticalPipelineHealthScore
      ) {
        insights.push({
          category: "pipeline",
          severity: "critical",
          audience: "executive",

          title:
            "Pipeline health requires immediate intervention",

          headline:
            `Pipeline health score is ${pipeline.healthScore}.`,

          narrative:
            "Pipeline quality, activity, coverage, or velocity has deteriorated to a critical level.",

          businessImpact:
            "The current pipeline may not reliably support forecast commitments or future revenue targets.",

          recommendedAction:
            "Initiate an executive pipeline recovery review across coverage, quality, stage aging, and owner performance.",

          confidenceScore: 90,

          percentage:
            pipeline.healthScore,

          evidence: [
            `pipeline-health-score:${pipeline.healthScore}`,
            `pipeline-grade:${pipeline.healthGrade ?? "unknown"}`,
          ],
        });
      } else if (
        pipeline.healthScore
        < this.configuration
          .highPipelineHealthScore
      ) {
        insights.push({
          category: "pipeline",
          severity: "high",
          audience: "sales-leadership",

          title:
            "Pipeline health is at risk",

          headline:
            `Pipeline health score is ${pipeline.healthScore}.`,

          narrative:
            "The pipeline requires corrective action before forecast reliability declines further.",

          businessImpact:
            "Insufficient pipeline quality or velocity may reduce future revenue conversion.",

          recommendedAction:
            "Review bottlenecks, inactive opportunities, overdue actions, and coverage gaps.",

          confidenceScore: 85,

          percentage:
            pipeline.healthScore,

          evidence: [
            `pipeline-health-score:${pipeline.healthScore}`,
          ],
        });
      }
    }

    if (
      pipeline.coverageRatio
      !== undefined
      && pipeline.coverageRatio < 1
    ) {
      insights.push({
        category: "pipeline",
        severity:
          pipeline.coverageRatio < 0.6
            ? "critical"
            : "high",

        audience:
          "sales-leadership",

        title:
          "Pipeline coverage is insufficient",

        headline:
          `Pipeline coverage is ${roundExecutiveAIInsightNumber(pipeline.coverageRatio)}x.`,

        narrative:
          "Open pipeline value does not provide sufficient coverage against the active revenue target.",

        businessImpact:
          "The business has limited capacity to absorb deal slippage or losses.",

        recommendedAction:
          "Accelerate qualified pipeline creation and prioritize opportunities with near-term revenue potential.",

        confidenceScore: 90,

        percentage:
          roundExecutiveAIInsightNumber(
            pipeline.coverageRatio
            * 100,
          ),

        amount:
          pipeline.pipelineGap,

        evidence: [
          `coverage-ratio:${pipeline.coverageRatio}`,
          `pipeline-gap:${pipeline.pipelineGap ?? 0}`,
        ],
      });
    }

    if (
      (
        pipeline.criticalOpportunityCount
        ?? 0
      ) > 0
    ) {
      insights.push({
        category: "opportunity",
        severity:
          (
            pipeline.criticalOpportunityCount
            ?? 0
          ) >= 3
            ? "critical"
            : "high",

        audience: "sales-leadership",

        title:
          "Critical opportunities require management action",

        headline:
          `${pipeline.criticalOpportunityCount} opportunities are classified as critical.`,

        narrative:
          "A portion of the active pipeline has severe inactivity, stage aging, risk exposure, or execution weakness.",

        businessImpact:
          "Revenue timing and forecast confidence are exposed to unresolved opportunity-level risks.",

        recommendedAction:
          "Assign executive or manager-led recovery plans to all critical opportunities.",

        confidenceScore: 92,

        evidence: [
          `critical-opportunities:${pipeline.criticalOpportunityCount}`,
          `stale-opportunities:${pipeline.staleOpportunityCount ?? 0}`,
        ],
      });
    }

    if (
      (
        pipeline.overdueActionCount
        ?? 0
      ) > 0
    ) {
      insights.push({
        category: "operations",
        severity:
          (
            pipeline.overdueActionCount
            ?? 0
          ) >= 10
            ? "high"
            : "medium",

        audience: "sales-manager",

        title:
          "Overdue sales actions are accumulating",

        headline:
          `${pipeline.overdueActionCount} overdue actions are affecting pipeline execution.`,

        narrative:
          "Delayed next actions may be weakening customer engagement and opportunity momentum.",

        businessImpact:
          "Execution delays increase the probability of deal slippage and forecast deterioration.",

        recommendedAction:
          "Clear overdue actions, confirm owners, and enforce time-bound next steps.",

        confidenceScore: 88,

        evidence: [
          `overdue-actions:${pipeline.overdueActionCount}`,
        ],
      });
    }

    return insights;
  }

  private buildOpportunityInsights(
    context:
      ExecutiveAIInsightContext,
  ): DraftExecutiveInsight[] {
    const opportunities =
      context.opportunities
      ?? [];

    if (opportunities.length === 0) {
      return [];
    }

    const insights:
      DraftExecutiveInsight[] = [];

    const sortedByAmount =
      [...opportunities].sort(
        (left, right) =>
          right.amount - left.amount,
      );

    const totalValue =
      opportunities.reduce(
        (total, opportunity) =>
          total
          + Math.max(
            0,
            opportunity.amount,
          ),
        0,
      );

    const largest =
      sortedByAmount[0];

    if (
      largest
      && totalValue > 0
    ) {
      const concentration =
        (
          largest.amount
          / totalValue
        ) * 100;

      if (concentration >= 40) {
        insights.push({
          category: "opportunity",

          severity:
            concentration >= 65
              ? "critical"
              : "high",

          audience: "executive",

          title:
            "Revenue is concentrated in a single opportunity",

          headline:
            `${roundExecutiveAIInsightNumber(concentration)}% of tracked opportunity value depends on one deal.`,

          narrative:
            `The opportunity "${largest.name ?? largest.opportunityId}" represents a material concentration of expected revenue.`,

          businessImpact:
            "Loss or delay of this opportunity would materially affect revenue performance.",

          recommendedAction:
            "Establish an executive close plan and strengthen alternative pipeline coverage.",

          confidenceScore: 95,

          amount:
            largest.amount,

          percentage:
            roundExecutiveAIInsightNumber(
              concentration,
            ),

          opportunityIds: [
            largest.opportunityId,
          ],

          evidence: [
            `largest-opportunity:${largest.opportunityId}`,
            `largest-opportunity-value:${largest.amount}`,
            `total-opportunity-value:${totalValue}`,
          ],
        });
      }
    }

    const highRisk =
      opportunities.filter(
        (opportunity) =>
          (
            opportunity.riskScore
            ?? 0
          ) >= 70,
      );

    if (highRisk.length > 0) {
      insights.push({
        category: "risk",

        severity:
          highRisk.length >= 3
            ? "critical"
            : "high",

        audience:
          "sales-leadership",

        title:
          "High-risk opportunities threaten expected revenue",

        headline:
          `${highRisk.length} opportunities carry elevated risk scores.`,

        narrative:
          "Several opportunities may require immediate qualification, stakeholder, competitive, or execution intervention.",

        businessImpact:
          "A meaningful portion of expected revenue may fail to convert without corrective action.",

        recommendedAction:
          "Review each high-risk opportunity and require an evidence-backed recovery plan.",

        confidenceScore: 90,

        amount:
          roundExecutiveAIInsightNumber(
            highRisk.reduce(
              (total, opportunity) =>
                total
                + opportunity.amount,
              0,
            ),
          ),

        opportunityIds:
          highRisk.map(
            (opportunity) =>
              opportunity.opportunityId,
          ),

        evidence:
          highRisk.map(
            (opportunity) =>
              `${opportunity.opportunityId}:${opportunity.riskScore ?? 0}`,
          ),
      });
    }

    const stale =
      opportunities.filter(
        (opportunity) =>
          (
            opportunity.daysSinceLastActivity
            ?? 0
          ) >= 21,
      );

    if (stale.length > 0) {
      insights.push({
        category: "opportunity",

        severity:
          stale.length >= 5
            ? "high"
            : "medium",

        audience:
          "sales-manager",

        title:
          "Opportunity inactivity is reducing momentum",

        headline:
          `${stale.length} opportunities have extended customer inactivity.`,

        narrative:
          "Long inactivity periods indicate weak customer engagement or outdated forecast assumptions.",

        businessImpact:
          "Inactive opportunities may slip, be lost, or remain incorrectly represented in the forecast.",

        recommendedAction:
          "Require immediate outreach, milestone confirmation, or opportunity reclassification.",

        confidenceScore: 88,

        amount:
          roundExecutiveAIInsightNumber(
            stale.reduce(
              (total, opportunity) =>
                total
                + opportunity.amount,
              0,
            ),
          ),

        opportunityIds:
          stale.map(
            (opportunity) =>
              opportunity.opportunityId,
          ),

        evidence:
          stale.map(
            (opportunity) =>
              `${opportunity.opportunityId}:${opportunity.daysSinceLastActivity ?? 0}`,
          ),
      });
    }

    const committedHighProbability =
      opportunities.filter(
        (opportunity) =>
          opportunity.committed
          && (
            opportunity.winProbability
            ?? 0
          ) >= 70
          && (
            opportunity.riskScore
            ?? 100
          ) < 40,
      );

    if (
      committedHighProbability.length > 0
    ) {
      insights.push({
        category: "opportunity",
        severity: "informational",
        audience: "executive",

        title:
          "Committed opportunities provide forecast support",

        headline:
          `${committedHighProbability.length} committed opportunities have strong win probability and controlled risk.`,

        narrative:
          "These opportunities are the strongest contributors to near-term forecast confidence.",

        businessImpact:
          "Protecting these opportunities supports revenue predictability and target attainment.",

        recommendedAction:
          "Maintain executive visibility and ensure no unresolved customer or delivery blockers remain.",

        confidenceScore: 85,

        amount:
          roundExecutiveAIInsightNumber(
            committedHighProbability.reduce(
              (total, opportunity) =>
                total
                + opportunity.amount,
              0,
            ),
          ),

        opportunityIds:
          committedHighProbability.map(
            (opportunity) =>
              opportunity.opportunityId,
          ),

        evidence:
          committedHighProbability.map(
            (opportunity) =>
              `${opportunity.opportunityId}:${opportunity.winProbability ?? 0}`,
          ),
      });
    }

    return insights;
  }

  private buildPerformanceInsights(
    context:
      ExecutiveAIInsightContext,
  ): DraftExecutiveInsight[] {
    const performance =
      context.salesPerformance
      ?? [];

    if (performance.length === 0) {
      return [];
    }

    const insights:
      DraftExecutiveInsight[] = [];

    const atRiskOwners =
      performance.filter(
        (owner) =>
          (
            owner.targetAttainmentPercentage
            ?? 100
          ) < 70
          || (
            owner.overdueActionCount
            ?? 0
          ) >= 5,
      );

    if (atRiskOwners.length > 0) {
      insights.push({
        category:
          "sales-performance",

        severity:
          atRiskOwners.length
          >= Math.max(
            2,
            Math.ceil(
              performance.length / 2,
            ),
          )
            ? "high"
            : "medium",

        audience:
          "sales-leadership",

        title:
          "Sales execution varies materially across owners",

        headline:
          `${atRiskOwners.length} sales owners require performance intervention.`,

        narrative:
          "Target attainment, overdue actions, or opportunity execution is materially weaker for a subset of the sales team.",

        businessImpact:
          "Uneven sales execution may reduce pipeline conversion and increase revenue concentration in top performers.",

        recommendedAction:
          "Initiate targeted coaching, portfolio inspection, and recovery plans for underperforming owners.",

        confidenceScore: 87,

        evidence:
          atRiskOwners.map(
            (owner) =>
              `${owner.ownerId}:${owner.targetAttainmentPercentage ?? 0}`,
          ),
      });
    }

    const strongOwners =
      performance.filter(
        (owner) =>
          (
            owner.targetAttainmentPercentage
            ?? 0
          ) >= 100
          && (
            owner.winRate
            ?? 0
          ) >= 50,
      );

    if (strongOwners.length > 0) {
      insights.push({
        category:
          "sales-performance",

        severity:
          "informational",

        audience:
          "sales-leadership",

        title:
          "Top performers are exceeding revenue expectations",

        headline:
          `${strongOwners.length} sales owners are meeting target and maintaining strong conversion.`,

        narrative:
          "High-performing owners demonstrate sales practices that may be reusable across the wider team.",

        businessImpact:
          "Replicating successful behaviors can improve team-wide conversion, productivity, and forecast quality.",

        recommendedAction:
          "Identify repeatable behaviors from top performers and incorporate them into coaching playbooks.",

        confidenceScore: 82,

        evidence:
          strongOwners.map(
            (owner) =>
              `${owner.ownerId}:${owner.targetAttainmentPercentage ?? 0}`,
          ),
      });
    }

    const coachingCritical =
      performance.filter(
        (owner) =>
          (
            owner.criticalCoachingCount
            ?? 0
          ) > 0,
      );

    if (
      coachingCritical.length > 0
    ) {
      insights.push({
        category:
          "sales-performance",

        severity: "high",

        audience:
          "sales-manager",

        title:
          "Critical coaching recommendations require action",

        headline:
          `${coachingCritical.length} sales owners have critical coaching recommendations.`,

        narrative:
          "The coaching engine has identified execution weaknesses that require manager intervention.",

        businessImpact:
          "Unresolved coaching needs may continue to reduce opportunity progression and conversion.",

        recommendedAction:
          "Schedule focused coaching sessions and track recommendation completion.",

        confidenceScore: 90,

        evidence:
          coachingCritical.map(
            (owner) =>
              `${owner.ownerId}:${owner.criticalCoachingCount ?? 0}`,
          ),
      });
    }

    return insights;
  }

  private buildRiskInsights(
    context:
      ExecutiveAIInsightContext,
  ): DraftExecutiveInsight[] {
    const risks =
      context.risks
      ?? [];

    return risks.map(
      (
        risk,
      ): DraftExecutiveInsight => ({
        category:
          risk.category,

        severity:
          risk.severity,

        audience:
          risk.severity === "critical"
            ? "executive"
            : "sales-leadership",

        title:
          risk.title,

        headline:
          risk.title,

        narrative:
          risk.description,

        businessImpact:
          risk.amountAtRisk
            !== undefined
            ? `${roundExecutiveAIInsightNumber(risk.amountAtRisk)} of revenue or pipeline value is exposed.`
            : "The identified risk may affect revenue performance, forecast confidence, or operational execution.",

        recommendedAction:
          risk.recommendedAction,

        confidenceScore:
          risk.probability
          ?? 80,

        amount:
          risk.amountAtRisk,

        percentage:
          risk.probability,

        opportunityIds:
          risk.opportunityIds,

        evidence: [
          `risk-id:${risk.riskId}`,
          `risk-severity:${risk.severity}`,
        ],
      }),
    );
  }

  private buildRecommendations(
    context:
      ExecutiveAIInsightContext,
    insights:
      readonly ExecutiveAIInsight[],
  ): readonly ExecutiveAIInsightRecommendation[] {
    const recommendations:
      ExecutiveAIInsightRecommendation[] = [];

    for (
      const insight
      of insights
    ) {
      if (
        !insight.recommendedAction
      ) {
        continue;
      }

      recommendations.push({
        id: "",

        priority:
          insight.priority,

        audience:
          insight.audience,

        title:
          insight.recommendedAction,

        description:
          insight.narrative,

        rationale:
          insight.businessImpact,

        expectedImpact:
          this.resolveExpectedImpact(
            insight.category,
          ),

        actionType:
          this.resolveActionType(
            insight.category,
          ),

        opportunityIds:
          insight.opportunityIds,
      });
    }

    for (
      const recommendation
      of context.recommendations
      ?? []
    ) {
      recommendations.push({
        id: "",

        priority:
          recommendation.priority,

        audience:
          recommendation.ownerScope,

        title:
          recommendation.title,

        description:
          recommendation.description,

        rationale:
          recommendation.rationale
          ?? "The recommendation was generated by an upstream revenue intelligence engine.",

        expectedImpact:
          recommendation.expectedImpact
          ?? "Improve revenue execution, pipeline quality, or forecast confidence.",

        actionType:
          recommendation.ownerScope
            === "executive"
            ? "intervene"
            : "review",

        opportunityIds:
          recommendation.opportunityIds,
      });
    }

    const seen =
      new Set<string>();

    return recommendations
      .filter(
        (recommendation) => {
          const key =
            `${recommendation.priority}:${recommendation.title}`;

          if (seen.has(key)) {
            return false;
          }

          seen.add(key);

          return true;
        },
      )
      .sort(
        (left, right) => {
          const priorityWeight = {
            critical: 4,
            high: 3,
            medium: 2,
            low: 1,
          };

          return (
            priorityWeight[
              right.priority
            ]
            - priorityWeight[
              left.priority
            ]
          );
        },
      )
      .slice(
        0,
        this.configuration
          .maximumRecommendations,
      );
  }

  private buildBoardHighlights(
    context:
      ExecutiveAIInsightContext,
    insights:
      readonly ExecutiveAIInsight[],
  ): readonly ExecutiveBoardHighlight[] {
    const highlights:
      ExecutiveBoardHighlight[] = [];

    const critical =
      insights.find(
        (insight) =>
          insight.severity === "critical",
      );

    if (critical) {
      highlights.push({
        key:
          `critical:${critical.category}`,

        type: "risk",

        title:
          critical.title,

        narrative:
          critical.narrative,

        severity:
          critical.severity,

        metricValue:
          critical.amount
          ?? critical.percentage,

        metricLabel:
          critical.amount !== undefined
            ? "Amount at risk"
            : critical.percentage !== undefined
              ? "Risk percentage"
              : undefined,
      });
    }

    if (
      context.revenue
        ?.expectedRevenue
      !== undefined
    ) {
      highlights.push({
        key:
          "forecast:expected-revenue",

        type: "forecast",

        title:
          "Expected revenue",

        narrative:
          `Expected revenue for the active period is ${roundExecutiveAIInsightNumber(context.revenue.expectedRevenue)}.`,

        severity:
          (
            context.revenue
              .targetAttainmentPercentage
            ?? 100
          ) < 75
            ? "high"
            : "informational",

        metricValue:
          context.revenue
            .expectedRevenue,

        metricLabel:
          "Expected revenue",
      });
    }

    if (
      context.pipeline
        ?.healthScore
      !== undefined
    ) {
      highlights.push({
        key:
          "pipeline:health-score",

        type: "performance",

        title:
          "Pipeline health",

        narrative:
          `Pipeline health score is ${context.pipeline.healthScore}.`,

        severity:
          context.pipeline.healthScore
          < this.configuration
            .criticalPipelineHealthScore
            ? "critical"
            : context.pipeline.healthScore
              < this.configuration
                .highPipelineHealthScore
              ? "high"
              : "informational",

        metricValue:
          context.pipeline
            .healthScore,

        metricLabel:
          "Health score",
      });
    }

    const positive =
      insights.find(
        (insight) =>
          insight.severity
          === "informational",
      );

    if (positive) {
      highlights.push({
        key:
          `strength:${positive.category}`,

        type: "strength",

        title:
          positive.title,

        narrative:
          positive.narrative,

        severity:
          positive.severity,

        metricValue:
          positive.amount
          ?? positive.percentage,

        metricLabel:
          positive.amount !== undefined
            ? "Value"
            : positive.percentage !== undefined
              ? "Percentage"
              : undefined,
      });
    }

    const priorityRecommendation =
      insights.find(
        (insight) =>
          insight.recommendedAction
          && (
            insight.severity
              === "critical"
            || insight.severity
              === "high"
          ),
      );

    if (
      priorityRecommendation
      ?.recommendedAction
    ) {
      highlights.push({
        key:
          "decision:priority-action",

        type: "decision",

        title:
          "Priority executive action",

        narrative:
          priorityRecommendation
            .recommendedAction,

        severity:
          priorityRecommendation
            .severity,
      });
    }

    return highlights.slice(
      0,
      this.configuration
        .maximumBoardHighlights,
    );
  }

  private calculateExecutiveScore(
    context:
      ExecutiveAIInsightContext,
    insights:
      readonly ExecutiveAIInsight[],
  ): number {
    const revenueScore =
      this.calculateRevenueScore(
        context,
      );

    const pipelineScore =
      context.pipeline
        ?.healthScore
      ?? 60;

    const forecastScore =
      context.revenue
        ?.forecastConfidenceScore
      ?? 60;

    const severeRiskPenalty =
      insights.reduce(
        (total, insight) => {
          switch (
            insight.severity
          ) {
            case "critical":
              return total + 12;

            case "high":
              return total + 6;

            case "medium":
              return total + 2;

            case "low":
            case "informational":
            default:
              return total;
          }
        },
        0,
      );

    return roundExecutiveAIInsightNumber(
      clampExecutiveAIInsightScore(
        revenueScore * 0.4
        + pipelineScore * 0.35
        + forecastScore * 0.25
        - severeRiskPenalty,
      ),
    );
  }

  private calculateRevenueScore(
    context:
      ExecutiveAIInsightContext,
  ): number {
    const attainment =
      context.revenue
        ?.targetAttainmentPercentage;

    if (
      attainment !== undefined
    ) {
      return clampExecutiveAIInsightScore(
        attainment,
      );
    }

    const target =
      context.revenue
        ?.targetRevenue;

    const expected =
      context.revenue
        ?.expectedRevenue;

    if (
      target !== undefined
      && target > 0
      && expected !== undefined
    ) {
      return clampExecutiveAIInsightScore(
        (
          expected / target
        ) * 100,
      );
    }

    return 60;
  }

  private resolvePreviousExecutiveScore(
    context:
      ExecutiveAIInsightContext,
  ): number | undefined {
    const previousRevenue =
      context.revenue
        ?.previousExpectedRevenue;

    const target =
      context.revenue
        ?.targetRevenue;

    const previousPipeline =
      context.pipeline
        ?.previousHealthScore;

    if (
      previousRevenue === undefined
      && previousPipeline
        === undefined
    ) {
      return undefined;
    }

    const revenueScore =
      previousRevenue !== undefined
      && target !== undefined
      && target > 0
        ? clampExecutiveAIInsightScore(
          (
            previousRevenue
            / target
          ) * 100,
        )
        : 60;

    return roundExecutiveAIInsightNumber(
      revenueScore * 0.55
      + (
        previousPipeline
        ?? 60
      ) * 0.45,
    );
  }

  private buildSummary(
    executiveScore: number,
    insights:
      readonly ExecutiveAIInsight[],
    recommendations:
      readonly ExecutiveAIInsightRecommendation[],
  ): ExecutiveBriefingSummary {
    let executiveStatus:
      ExecutiveBriefingSummary["executiveStatus"];

    if (executiveScore >= 80) {
      executiveStatus = "strong";
    } else if (
      executiveScore >= 65
    ) {
      executiveStatus = "stable";
    } else if (
      executiveScore >= 45
    ) {
      executiveStatus =
        "attention-required";
    } else {
      executiveStatus =
        "intervention-required";
    }

    const critical =
      insights.find(
        (insight) =>
          insight.severity === "critical",
      );

    const positive =
      insights.find(
        (insight) =>
          insight.severity
          === "informational",
      );

    const priorityAction =
      recommendations[0];

    const headline =
      executiveStatus === "strong"
        ? "Revenue performance and pipeline execution are strong."
        : executiveStatus === "stable"
          ? "Revenue execution is stable with manageable risks."
          : executiveStatus === "attention-required"
            ? "Revenue performance requires management attention."
            : "Revenue execution requires immediate executive intervention.";

    const narrativeParts = [
      `Executive revenue intelligence score is ${executiveScore}.`,
    ];

    if (positive) {
      narrativeParts.push(
        `Primary strength: ${positive.title}.`,
      );
    }

    if (critical) {
      narrativeParts.push(
        `Primary risk: ${critical.title}.`,
      );
    } else {
      const high =
        insights.find(
          (insight) =>
            insight.severity === "high",
        );

      if (high) {
        narrativeParts.push(
          `Primary risk: ${high.title}.`,
        );
      }
    }

    if (priorityAction) {
      narrativeParts.push(
        `Priority action: ${priorityAction.title}.`,
      );
    }

    return {
      headline,

      narrative:
        narrativeParts.join(" "),

      executiveStatus,

      primaryStrength:
        positive?.title,

      primaryRisk:
        critical?.title
        ?? insights.find(
          (insight) =>
            insight.severity === "high",
        )?.title,

      primaryDecision:
        priorityAction?.title,
    };
  }

  private resolveExpectedImpact(
    category:
      ExecutiveAIInsight["category"],
  ): string {
    const impact:
      Record<
        ExecutiveAIInsight["category"],
        string
      > = {
        revenue:
          "Improve target attainment and protect expected revenue.",

        pipeline:
          "Improve pipeline quality, coverage, and revenue conversion.",

        forecast:
          "Increase forecast confidence and executive planning reliability.",

        opportunity:
          "Improve deal progression, close probability, and revenue timing.",

        "sales-performance":
          "Improve seller execution, productivity, and conversion consistency.",

        risk:
          "Reduce revenue exposure and prevent avoidable opportunity loss.",

        customer:
          "Improve customer engagement, retention, and commercial confidence.",

        operations:
          "Improve execution discipline, ownership, and workflow completion.",

        strategy:
          "Improve executive prioritization and resource allocation.",
      };

    return impact[category];
  }

  private resolveActionType(
    category:
      ExecutiveAIInsight["category"],
  ): ExecutiveAIInsightRecommendation["actionType"] {
    switch (category) {
      case "forecast":
        return "reforecast";

      case "pipeline":
        return "create-pipeline";

      case "sales-performance":
        return "coach";

      case "risk":
        return "mitigate-risk";

      case "opportunity":
        return "accelerate";

      case "revenue":
      case "strategy":
        return "intervene";

      case "customer":
      case "operations":
      default:
        return "review";
    }
  }

  private validateContext(
    context:
      ExecutiveAIInsightContext,
  ): void {
    if (!context.tenantId.trim()) {
      throw new Error(
        "Executive AI insights require a tenantId.",
      );
    }

    const periodStart =
      new Date(
        context.periodStart,
      );

    const periodEnd =
      new Date(
        context.periodEnd,
      );

    if (
      Number.isNaN(
        periodStart.getTime(),
      )
    ) {
      throw new Error(
        "Executive AI insights periodStart is invalid.",
      );
    }

    if (
      Number.isNaN(
        periodEnd.getTime(),
      )
    ) {
      throw new Error(
        "Executive AI insights periodEnd is invalid.",
      );
    }

    if (
      periodEnd <= periodStart
    ) {
      throw new Error(
        "Executive AI insights periodEnd must be after periodStart.",
      );
    }

    for (
      const opportunity
      of context.opportunities
      ?? []
    ) {
      if (
        !opportunity.opportunityId.trim()
      ) {
        throw new Error(
          "Executive AI insights received an opportunity without an opportunityId.",
        );
      }

      if (
        !Number.isFinite(
          opportunity.amount,
        )
        || opportunity.amount < 0
      ) {
        throw new Error(
          `Opportunity "${opportunity.opportunityId}" has an invalid amount.`,
        );
      }
    }
  }
}

export const createExecutiveAIInsightEngine = (
  dependencies:
    ExecutiveAIInsightEngineDependencies = {},
): ExecutiveAIInsightEngine =>
  new ExecutiveAIInsightEngine(
    dependencies,
  );
