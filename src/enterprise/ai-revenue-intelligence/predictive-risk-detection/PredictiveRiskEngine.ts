import {
  clampPredictiveRiskScore,
  resolveDaysBetween,
  resolvePredictiveRiskSeverity,
  resolvePredictiveRiskTrend,
  resolvePredictiveWeightedAmount,
  roundPredictiveRiskNumber,
  predictiveRiskSeverityWeight,
} from "./PredictiveRiskRules";
import type {
  PredictiveRiskAssessment,
  PredictiveRiskConfiguration,
  PredictiveRiskContext,
  PredictiveRiskDetection,
  PredictiveRiskEvidence,
  PredictiveRiskOpportunityInput,
  PredictiveRiskRecommendation,
  PredictiveRiskScope,
  PredictiveRiskSummary,
} from "./PredictiveRiskTypes";

const DEFAULT_CONFIGURATION:
  PredictiveRiskConfiguration = {
    modelVersion: "5.0.0",
    assessmentTtlHours: 12,

    criticalRiskThreshold: 80,
    highRiskThreshold: 60,
    mediumRiskThreshold: 35,

    staleActivityDays: 14,
    criticalActivityDays: 30,

    slowStageDays: 21,
    criticalStageDays: 45,

    criticalCoverageRatio: 0.6,
    highCoverageRatio: 1,

    concentrationRiskPercentage: 40,
    criticalConcentrationPercentage: 65,

    materialRiskScoreChange: 10,

    maximumRisks: 24,
    maximumRecommendations: 16,
  };

interface DraftRisk
  extends Omit<
    PredictiveRiskDetection,
    | "id"
    | "tenantId"
    | "workspaceId"
    | "status"
    | "detectedAt"
    | "expiresAt"
    | "modelVersion"
  > {}

export interface PredictiveRiskEngineDependencies {
  configuration?:
    Partial<PredictiveRiskConfiguration>;
}

export class PredictiveRiskEngine {
  private readonly configuration:
    PredictiveRiskConfiguration;

  constructor(
    dependencies:
      PredictiveRiskEngineDependencies = {},
  ) {
    this.configuration = {
      ...DEFAULT_CONFIGURATION,
      ...dependencies.configuration,
    };
  }

  generate(
    context: PredictiveRiskContext,
    generatedAt = new Date(),
  ): PredictiveRiskAssessment {
    this.validateContext(context);

    const expiresAt =
      new Date(
        generatedAt.getTime()
        + (
          this.configuration
            .assessmentTtlHours
          * 60
          * 60
          * 1000
        ),
      );

    const opportunityRisks =
      context.opportunities
        .filter(
          (opportunity) =>
            opportunity.isOpen,
        )
        .flatMap(
          (opportunity) =>
            this.detectOpportunityRisks(
              opportunity,
              generatedAt,
            ),
        );

    const aggregateRisks = [
      ...this.detectRevenueRisks(
        context,
      ),

      ...this.detectPipelineRisks(
        context,
      ),

      ...this.detectOwnerRisks(
        context,
        generatedAt,
      ),

      ...this.detectDataQualityRisks(
        context,
      ),
    ];

    const risks =
      [
        ...opportunityRisks,
        ...aggregateRisks,
      ]
        .sort(
          (left, right) =>
            predictiveRiskSeverityWeight[
              right.severity
            ]
            - predictiveRiskSeverityWeight[
              left.severity
            ]
            || right.riskScore
            - left.riskScore,
        )
        .slice(
          0,
          this.configuration
            .maximumRisks,
        )
        .map(
          (risk): PredictiveRiskDetection => ({
            ...risk,

            id: "",

            tenantId:
              context.tenantId,

            workspaceId:
              context.workspaceId,

            status: "detected",

            detectedAt:
              generatedAt.toISOString(),

            expiresAt:
              expiresAt.toISOString(),

            modelVersion:
              this.configuration
                .modelVersion,
          }),
        );

    const recommendations =
      this.buildRecommendations(
        risks,
      );

    const overallRiskScore =
      this.calculateOverallRiskScore(
        risks,
      );

    const overallSeverity =
      resolvePredictiveRiskSeverity(
        overallRiskScore,
        this.configuration,
      );

    const trendResolution =
      resolvePredictiveRiskTrend(
        overallRiskScore,
        context.previousAssessment
          ?.overallRiskScore,
      );

    const totalAmountAtRisk =
      roundPredictiveRiskNumber(
        risks.reduce(
          (total, risk) =>
            total
            + (
              risk.amountAtRisk
              ?? 0
            ),
          0,
        ),
      );

    const expectedRevenueLoss =
      roundPredictiveRiskNumber(
        risks.reduce(
          (total, risk) =>
            total
            + (
              risk.expectedLoss
              ?? 0
            ),
          0,
        ),
      );

    const summary =
      this.buildSummary(
        overallRiskScore,
        overallSeverity,
        risks,
        recommendations,
        totalAmountAtRisk,
      );

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

      overallRiskScore,
      overallSeverity,

      trend:
        trendResolution.trend,

      trendPercentage:
        trendResolution.percentage,

      totalAmountAtRisk,
      expectedRevenueLoss,

      riskCount:
        risks.length,

      criticalRiskCount:
        this.countSeverity(
          risks,
          "critical",
        ),

      highRiskCount:
        this.countSeverity(
          risks,
          "high",
        ),

      mediumRiskCount:
        this.countSeverity(
          risks,
          "medium",
        ),

      lowRiskCount:
        this.countSeverity(
          risks,
          "low",
        ),

      opportunityRiskCount:
        this.countScope(
          risks,
          "opportunity",
        ),

      pipelineRiskCount:
        this.countScope(
          risks,
          "pipeline",
        ),

      forecastRiskCount:
        this.countScope(
          risks,
          "forecast",
        ),

      revenueRiskCount:
        this.countScope(
          risks,
          "revenue",
        ),

      risks,
      recommendations,
      summary,

      managementAttentionRequired:
        overallSeverity === "critical"
        || this.countSeverity(
          risks,
          "critical",
        ) > 0
        || this.countSeverity(
          risks,
          "high",
        ) >= 3,

      metadata:
        context.metadata,
    };
  }

  private detectOpportunityRisks(
    opportunity:
      PredictiveRiskOpportunityInput,
    generatedAt: Date,
  ): DraftRisk[] {
    const risks:
      DraftRisk[] = [];

    const inactivityDays =
      opportunity.daysSinceLastActivity
      ?? resolveDaysBetween(
        opportunity.lastActivityAt,
        generatedAt,
        999,
      );

    const daysInStage =
      opportunity.daysInStage
      ?? resolveDaysBetween(
        opportunity.enteredStageAt,
        generatedAt,
        0,
      );

    const weightedAmount =
      resolvePredictiveWeightedAmount(
        opportunity.amount,
        opportunity.weightedAmount,
        opportunity.winProbability,
        opportunity.stageProbability,
      );

    if (
      inactivityDays
      >= this.configuration
        .staleActivityDays
    ) {
      const probabilityScore =
        inactivityDays
        >= this.configuration
          .criticalActivityDays
          ? 90
          : 65;

      const impactScore =
        this.calculateAmountImpactScore(
          opportunity.amount,
        );

      const riskScore =
        this.combineRiskScores(
          probabilityScore,
          impactScore,
        );

      risks.push({
        scope: "opportunity",
        category:
          "opportunity-inactivity",

        severity:
          resolvePredictiveRiskSeverity(
            riskScore,
            this.configuration,
          ),

        title:
          "Opportunity inactivity risk",

        description:
          `Opportunity "${opportunity.name ?? opportunity.opportunityId}" has been inactive for ${inactivityDays} days.`,

        probabilityScore,
        impactScore,
        riskScore,

        confidenceScore:
          opportunity.lastActivityAt
          || opportunity.daysSinceLastActivity
            !== undefined
            ? 92
            : 55,

        amountAtRisk:
          roundPredictiveRiskNumber(
            opportunity.amount,
          ),

        expectedLoss:
          roundPredictiveRiskNumber(
            weightedAmount
            * (
              probabilityScore / 100
            ),
          ),

        delayProbability:
          probabilityScore,

        estimatedDelayDays:
          Math.max(
            7,
            inactivityDays
            - this.configuration
              .staleActivityDays,
          ),

        opportunityId:
          opportunity.opportunityId,

        ownerId:
          opportunity.ownerId,

        accountId:
          opportunity.accountId,

        opportunityIds: [
          opportunity.opportunityId,
        ],

        evidence: [
          this.evidence(
            "inactivity-days",
            "Days since last activity",
            inactivityDays,
            0.35,
            "increases-risk",
          ),

          this.evidence(
            "opportunity-amount",
            "Opportunity amount",
            opportunity.amount,
            0.25,
            "increases-risk",
          ),

          this.evidence(
            "momentum-score",
            "Momentum score",
            opportunity.momentumScore
            ?? 50,
            0.2,
            (
              opportunity.momentumScore
              ?? 50
            ) < 40
              ? "increases-risk"
              : "neutral",
          ),
        ],

        recommendedAction:
          "Require immediate customer engagement, confirm the next milestone, or remove unsupported forecast assumptions.",

        mitigationDeadline:
          this.addDays(
            generatedAt,
            2,
          ),
      });
    }

    if (
      daysInStage
      >= this.configuration
        .slowStageDays
    ) {
      const probabilityScore =
        daysInStage
        >= this.configuration
          .criticalStageDays
          ? 88
          : 62;

      const impactScore =
        this.calculateAmountImpactScore(
          opportunity.amount,
        );

      const riskScore =
        this.combineRiskScores(
          probabilityScore,
          impactScore,
        );

      risks.push({
        scope: "opportunity",
        category:
          "stage-stagnation",

        severity:
          resolvePredictiveRiskSeverity(
            riskScore,
            this.configuration,
          ),

        title:
          "Opportunity stage stagnation",

        description:
          `Opportunity "${opportunity.name ?? opportunity.opportunityId}" has remained in stage "${opportunity.stage ?? "unknown"}" for ${daysInStage} days.`,

        probabilityScore,
        impactScore,
        riskScore,

        confidenceScore: 90,

        amountAtRisk:
          opportunity.amount,

        expectedLoss:
          roundPredictiveRiskNumber(
            weightedAmount
            * (
              probabilityScore / 100
            )
            * 0.65,
          ),

        delayProbability:
          probabilityScore,

        estimatedDelayDays:
          Math.max(
            7,
            daysInStage
            - this.configuration
              .slowStageDays,
          ),

        opportunityId:
          opportunity.opportunityId,

        ownerId:
          opportunity.ownerId,

        accountId:
          opportunity.accountId,

        opportunityIds: [
          opportunity.opportunityId,
        ],

        evidence: [
          this.evidence(
            "days-in-stage",
            "Days in stage",
            daysInStage,
            0.4,
            "increases-risk",
          ),

          this.evidence(
            "stage",
            "Current stage",
            opportunity.stage
            ?? "unknown",
            0.15,
            "neutral",
          ),

          this.evidence(
            "stage-regressions",
            "Stage regression count",
            opportunity.stageRegressionCount
            ?? 0,
            0.25,
            (
              opportunity.stageRegressionCount
              ?? 0
            ) > 0
              ? "increases-risk"
              : "neutral",
          ),
        ],

        recommendedAction:
          "Review stage exit criteria, blockers, stakeholder alignment, and close-date validity.",

        mitigationDeadline:
          this.addDays(
            generatedAt,
            3,
          ),
      });
    }

    const stakeholderRiskScore =
      this.calculateStakeholderRisk(
        opportunity,
      );

    if (stakeholderRiskScore >= 35) {
      const impactScore =
        this.calculateAmountImpactScore(
          opportunity.amount,
        );

      const riskScore =
        this.combineRiskScores(
          stakeholderRiskScore,
          impactScore,
        );

      risks.push({
        scope: "opportunity",
        category:
          "stakeholder-risk",

        severity:
          resolvePredictiveRiskSeverity(
            riskScore,
            this.configuration,
          ),

        title:
          "Stakeholder coverage risk",

        description:
          `Opportunity "${opportunity.name ?? opportunity.opportunityId}" has incomplete stakeholder coverage.`,

        probabilityScore:
          stakeholderRiskScore,

        impactScore,
        riskScore,

        confidenceScore:
          opportunity.stakeholderCount
            !== undefined
            ? 88
            : 60,

        amountAtRisk:
          opportunity.amount,

        expectedLoss:
          roundPredictiveRiskNumber(
            weightedAmount
            * (
              stakeholderRiskScore
              / 100
            )
            * 0.55,
          ),

        opportunityId:
          opportunity.opportunityId,

        ownerId:
          opportunity.ownerId,

        accountId:
          opportunity.accountId,

        opportunityIds: [
          opportunity.opportunityId,
        ],

        evidence: [
          this.evidence(
            "stakeholder-count",
            "Stakeholder count",
            opportunity.stakeholderCount
            ?? 0,
            0.25,
            (
              opportunity.stakeholderCount
              ?? 0
            ) < 2
              ? "increases-risk"
              : "neutral",
          ),

          this.evidence(
            "decision-maker",
            "Decision maker confirmed",
            opportunity.decisionMakerConfirmed
            ?? false,
            0.25,
            opportunity.decisionMakerConfirmed
              ? "reduces-risk"
              : "increases-risk",
          ),

          this.evidence(
            "economic-buyer",
            "Economic buyer confirmed",
            opportunity.economicBuyerConfirmed
            ?? false,
            0.25,
            opportunity.economicBuyerConfirmed
              ? "reduces-risk"
              : "increases-risk",
          ),

          this.evidence(
            "champion",
            "Champion confirmed",
            opportunity.championConfirmed
            ?? false,
            0.25,
            opportunity.championConfirmed
              ? "reduces-risk"
              : "increases-risk",
          ),
        ],

        recommendedAction:
          "Confirm the decision maker, economic buyer, internal champion, and stakeholder decision process.",

        mitigationDeadline:
          this.addDays(
            generatedAt,
            5,
          ),
      });
    }

    const executionRisk =
      this.calculateExecutionRisk(
        opportunity,
      );

    if (executionRisk >= 35) {
      const impactScore =
        this.calculateAmountImpactScore(
          opportunity.amount,
        );

      const riskScore =
        this.combineRiskScores(
          executionRisk,
          impactScore,
        );

      risks.push({
        scope: "opportunity",
        category:
          "execution-risk",

        severity:
          resolvePredictiveRiskSeverity(
            riskScore,
            this.configuration,
          ),

        title:
          "Opportunity execution risk",

        description:
          `Opportunity "${opportunity.name ?? opportunity.opportunityId}" has execution weaknesses across actions, momentum, or data stability.`,

        probabilityScore:
          executionRisk,

        impactScore,
        riskScore,

        confidenceScore: 88,

        amountAtRisk:
          opportunity.amount,

        expectedLoss:
          roundPredictiveRiskNumber(
            weightedAmount
            * (
              executionRisk / 100
            )
            * 0.6,
          ),

        opportunityId:
          opportunity.opportunityId,

        ownerId:
          opportunity.ownerId,

        accountId:
          opportunity.accountId,

        opportunityIds: [
          opportunity.opportunityId,
        ],

        evidence: [
          this.evidence(
            "overdue-actions",
            "Overdue action count",
            opportunity.overdueActionCount
            ?? 0,
            0.3,
            (
              opportunity.overdueActionCount
              ?? 0
            ) > 0
              ? "increases-risk"
              : "neutral",
          ),

          this.evidence(
            "close-date-changes",
            "Close date change count",
            opportunity.closeDateChangeCount
            ?? 0,
            0.25,
            (
              opportunity.closeDateChangeCount
              ?? 0
            ) > 1
              ? "increases-risk"
              : "neutral",
          ),

          this.evidence(
            "momentum-score",
            "Momentum score",
            opportunity.momentumScore
            ?? 50,
            0.25,
            (
              opportunity.momentumScore
              ?? 50
            ) < 40
              ? "increases-risk"
              : "reduces-risk",
          ),

          this.evidence(
            "customer-sentiment",
            "Customer sentiment score",
            opportunity.customerSentimentScore
            ?? 50,
            0.2,
            (
              opportunity.customerSentimentScore
              ?? 50
            ) < 40
              ? "increases-risk"
              : "neutral",
          ),
        ],

        recommendedAction:
          "Establish a time-bound recovery plan with validated customer milestones and accountable next actions.",

        mitigationDeadline:
          this.addDays(
            generatedAt,
            3,
          ),
      });
    }

    const lossRisk =
      this.calculateDealLossRisk(
        opportunity,
      );

    if (lossRisk >= 45) {
      const impactScore =
        this.calculateAmountImpactScore(
          opportunity.amount,
        );

      const riskScore =
        this.combineRiskScores(
          lossRisk,
          impactScore,
        );

      risks.push({
        scope: "opportunity",
        category:
          "deal-loss",

        severity:
          resolvePredictiveRiskSeverity(
            riskScore,
            this.configuration,
          ),

        title:
          "Predictive deal-loss risk",

        description:
          `Opportunity "${opportunity.name ?? opportunity.opportunityId}" has an elevated predicted loss probability.`,

        probabilityScore:
          lossRisk,

        impactScore,
        riskScore,

        confidenceScore: 82,

        amountAtRisk:
          opportunity.amount,

        expectedLoss:
          roundPredictiveRiskNumber(
            opportunity.amount
            * (
              lossRisk / 100
            ),
          ),

        opportunityId:
          opportunity.opportunityId,

        ownerId:
          opportunity.ownerId,

        accountId:
          opportunity.accountId,

        opportunityIds: [
          opportunity.opportunityId,
        ],

        evidence: [
          this.evidence(
            "risk-score",
            "Opportunity risk score",
            opportunity.riskScore
            ?? 30,
            0.3,
            "increases-risk",
          ),

          this.evidence(
            "win-probability",
            "Win probability",
            opportunity.winProbability
            ?? opportunity.stageProbability
            ?? 50,
            0.25,
            (
              opportunity.winProbability
              ?? opportunity.stageProbability
              ?? 50
            ) < 40
              ? "increases-risk"
              : "reduces-risk",
          ),

          this.evidence(
            "competitors",
            "Competitor count",
            opportunity.competitorCount
            ?? 0,
            0.15,
            (
              opportunity.competitorCount
              ?? 0
            ) > 0
              ? "increases-risk"
              : "neutral",
          ),

          this.evidence(
            "owner-win-rate",
            "Owner win rate",
            opportunity.ownerWinRate
            ?? 50,
            0.15,
            (
              opportunity.ownerWinRate
              ?? 50
            ) < 30
              ? "increases-risk"
              : "neutral",
          ),
        ],

        recommendedAction:
          "Requalify the opportunity, validate competitive positioning, and escalate strategic blockers.",

        mitigationDeadline:
          this.addDays(
            generatedAt,
            2,
          ),
      });
    }

    return risks;
  }

  private detectRevenueRisks(
    context: PredictiveRiskContext,
  ): DraftRisk[] {
    const revenue =
      context.revenue;

    if (!revenue) {
      return [];
    }

    const risks:
      DraftRisk[] = [];

    const target =
      revenue.revenueTarget;

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

      if (gapPercentage >= 10) {
        const probabilityScore =
          clampPredictiveRiskScore(
            gapPercentage * 2,
          );

        const impactScore =
          clampPredictiveRiskScore(
            gapPercentage * 1.5,
          );

        const riskScore =
          this.combineRiskScores(
            probabilityScore,
            impactScore,
          );

        risks.push({
          scope: "revenue",
          category:
            "revenue-shortfall",

          severity:
            resolvePredictiveRiskSeverity(
              riskScore,
              this.configuration,
            ),

          title:
            "Predicted revenue shortfall",

          description:
            `Expected revenue is ${roundPredictiveRiskNumber(gapPercentage)}% below target.`,

          probabilityScore,
          impactScore,
          riskScore,

          confidenceScore:
            revenue.forecastConfidenceScore
            ?? 75,

          amountAtRisk:
            roundPredictiveRiskNumber(
              gap,
            ),

          expectedLoss:
            roundPredictiveRiskNumber(
              gap
              * (
                probabilityScore / 100
              ),
            ),

          evidence: [
            this.evidence(
              "revenue-target",
              "Revenue target",
              target,
              0.35,
              "neutral",
            ),

            this.evidence(
              "expected-revenue",
              "Expected revenue",
              expected,
              0.35,
              "increases-risk",
            ),

            this.evidence(
              "target-attainment",
              "Target attainment percentage",
              revenue.targetAttainmentPercentage
              ?? (
                expected / target
              ) * 100,
              0.3,
              "increases-risk",
            ),
          ],

          recommendedAction:
            "Launch a revenue recovery plan covering committed opportunities, pipeline creation, and forecast revalidation.",
        });
      }
    }

    if (
      revenue.previousExpectedRevenue
      !== undefined
      && revenue.previousExpectedRevenue
        > 0
      && expected !== undefined
    ) {
      const changePercentage =
        (
          (
            expected
            - revenue.previousExpectedRevenue
          )
          / revenue.previousExpectedRevenue
        ) * 100;

      if (changePercentage <= -10) {
        const probabilityScore =
          clampPredictiveRiskScore(
            Math.abs(
              changePercentage,
            ) * 2.5,
          );

        const riskScore =
          this.combineRiskScores(
            probabilityScore,
            70,
          );

        risks.push({
          scope: "forecast",
          category:
            "forecast-instability",

          severity:
            resolvePredictiveRiskSeverity(
              riskScore,
              this.configuration,
            ),

          title:
            "Forecast deterioration risk",

          description:
            `Expected revenue declined by ${roundPredictiveRiskNumber(Math.abs(changePercentage))}% versus the previous forecast.`,

          probabilityScore,
          impactScore: 70,
          riskScore,

          confidenceScore:
            revenue.forecastConfidenceScore
            ?? 75,

          amountAtRisk:
            roundPredictiveRiskNumber(
              revenue.previousExpectedRevenue
              - expected,
            ),

          expectedLoss:
            roundPredictiveRiskNumber(
              Math.max(
                0,
                revenue.previousExpectedRevenue
                - expected,
              ),
            ),

          evidence: [
            this.evidence(
              "previous-forecast",
              "Previous expected revenue",
              revenue.previousExpectedRevenue,
              0.4,
              "neutral",
            ),

            this.evidence(
              "current-forecast",
              "Current expected revenue",
              expected,
              0.4,
              "increases-risk",
            ),

            this.evidence(
              "forecast-change",
              "Forecast change percentage",
              changePercentage,
              0.2,
              "increases-risk",
            ),
          ],

          recommendedAction:
            "Identify the opportunities responsible for the decline and require evidence-backed recovery actions.",
        });
      }
    }

    if (
      revenue.forecastConfidenceScore
      !== undefined
      && revenue.forecastConfidenceScore
        < 50
    ) {
      const probabilityScore =
        100
        - revenue.forecastConfidenceScore;

      const riskScore =
        this.combineRiskScores(
          probabilityScore,
          60,
        );

      risks.push({
        scope: "forecast",
        category:
          "forecast-instability",

        severity:
          resolvePredictiveRiskSeverity(
            riskScore,
            this.configuration,
          ),

        title:
          "Low forecast confidence risk",

        description:
          `Forecast confidence is ${revenue.forecastConfidenceScore}.`,

        probabilityScore,
        impactScore: 60,
        riskScore,

        confidenceScore: 95,

        evidence: [
          this.evidence(
            "forecast-confidence",
            "Forecast confidence score",
            revenue.forecastConfidenceScore,
            1,
            "increases-risk",
          ),
        ],

        recommendedAction:
          "Revalidate close dates, probabilities, pipeline categories, and supporting customer evidence.",
      });
    }

    return risks;
  }

  private detectPipelineRisks(
    context: PredictiveRiskContext,
  ): DraftRisk[] {
    const pipeline =
      context.pipeline;

    if (!pipeline) {
      return [];
    }

    const risks:
      DraftRisk[] = [];

    if (
      pipeline.coverageRatio
      !== undefined
      && pipeline.coverageRatio
        < this.configuration
          .highCoverageRatio
    ) {
      const probabilityScore =
        pipeline.coverageRatio
        < this.configuration
          .criticalCoverageRatio
          ? 90
          : 70;

      const impactScore =
        pipeline.coverageRatio
        < this.configuration
          .criticalCoverageRatio
          ? 90
          : 70;

      const riskScore =
        this.combineRiskScores(
          probabilityScore,
          impactScore,
        );

      risks.push({
        scope: "pipeline",
        category:
          "pipeline-coverage",

        severity:
          resolvePredictiveRiskSeverity(
            riskScore,
            this.configuration,
          ),

        title:
          "Pipeline coverage risk",

        description:
          `Pipeline coverage is ${roundPredictiveRiskNumber(pipeline.coverageRatio)}x.`,

        probabilityScore,
        impactScore,
        riskScore,

        confidenceScore: 92,

        amountAtRisk:
          context.revenue
            ?.targetGap,

        expectedLoss:
          context.revenue
            ?.targetGap,

        evidence: [
          this.evidence(
            "coverage-ratio",
            "Pipeline coverage ratio",
            pipeline.coverageRatio,
            0.6,
            "increases-risk",
          ),

          this.evidence(
            "weighted-pipeline",
            "Weighted pipeline value",
            pipeline.weightedPipelineValue
            ?? 0,
            0.4,
            "neutral",
          ),
        ],

        recommendedAction:
          "Accelerate qualified pipeline creation and protect high-probability opportunities.",
      });
    }

    const openOpportunities =
      context.opportunities.filter(
        (opportunity) =>
          opportunity.isOpen,
      );

    const totalPipeline =
      openOpportunities.reduce(
        (total, opportunity) =>
          total
          + Math.max(
            0,
            opportunity.amount,
          ),
        0,
      );

    if (
      totalPipeline > 0
      && openOpportunities.length > 0
    ) {
      const largest =
        openOpportunities.reduce(
          (current, opportunity) =>
            opportunity.amount
            > current.amount
              ? opportunity
              : current,
        );

      const concentrationPercentage =
        (
          largest.amount
          / totalPipeline
        ) * 100;

      if (
        concentrationPercentage
        >= this.configuration
          .concentrationRiskPercentage
      ) {
        const probabilityScore =
          concentrationPercentage
          >= this.configuration
            .criticalConcentrationPercentage
            ? 90
            : 70;

        const impactScore =
          clampPredictiveRiskScore(
            concentrationPercentage,
          );

        const riskScore =
          this.combineRiskScores(
            probabilityScore,
            impactScore,
          );

        risks.push({
          scope: "pipeline",
          category:
            "pipeline-concentration",

          severity:
            resolvePredictiveRiskSeverity(
              riskScore,
              this.configuration,
            ),

          title:
            "Pipeline concentration risk",

          description:
            `A single opportunity represents ${roundPredictiveRiskNumber(concentrationPercentage)}% of open pipeline value.`,

          probabilityScore,
          impactScore,
          riskScore,

          confidenceScore: 95,

          amountAtRisk:
            largest.amount,

          expectedLoss:
            roundPredictiveRiskNumber(
              largest.amount
              * (
                probabilityScore / 100
              ),
            ),

          opportunityId:
            largest.opportunityId,

          ownerId:
            largest.ownerId,

          accountId:
            largest.accountId,

          opportunityIds: [
            largest.opportunityId,
          ],

          evidence: [
            this.evidence(
              "largest-opportunity",
              "Largest opportunity amount",
              largest.amount,
              0.5,
              "increases-risk",
            ),

            this.evidence(
              "pipeline-total",
              "Total pipeline value",
              totalPipeline,
              0.25,
              "neutral",
            ),

            this.evidence(
              "concentration-percentage",
              "Concentration percentage",
              concentrationPercentage,
              0.25,
              "increases-risk",
            ),
          ],

          recommendedAction:
            "Create an executive close plan and develop alternative pipeline coverage.",
        });
      }
    }

    if (
      pipeline.healthScore
      !== undefined
      && pipeline.healthScore < 55
    ) {
      const probabilityScore =
        100 - pipeline.healthScore;

      const riskScore =
        this.combineRiskScores(
          probabilityScore,
          75,
        );

      risks.push({
        scope: "pipeline",
        category:
          "execution-risk",

        severity:
          resolvePredictiveRiskSeverity(
            riskScore,
            this.configuration,
          ),

        title:
          "Pipeline health deterioration risk",

        description:
          `Pipeline health score is ${pipeline.healthScore}.`,

        probabilityScore,
        impactScore: 75,
        riskScore,

        confidenceScore: 90,

        amountAtRisk:
          pipeline.weightedPipelineValue,

        expectedLoss:
          roundPredictiveRiskNumber(
            (
              pipeline.weightedPipelineValue
              ?? 0
            )
            * (
              probabilityScore / 100
            )
            * 0.45,
          ),

        evidence: [
          this.evidence(
            "pipeline-health",
            "Pipeline health score",
            pipeline.healthScore,
            0.5,
            "increases-risk",
          ),

          this.evidence(
            "critical-opportunities",
            "Critical opportunity count",
            pipeline.criticalOpportunityCount
            ?? 0,
            0.25,
            "increases-risk",
          ),

          this.evidence(
            "stale-opportunities",
            "Stale opportunity count",
            pipeline.staleOpportunityCount
            ?? 0,
            0.25,
            "increases-risk",
          ),
        ],

        recommendedAction:
          "Initiate a pipeline recovery review across coverage, quality, velocity, and ownership.",
      });
    }

    return risks;
  }

  private detectOwnerRisks(
    context: PredictiveRiskContext,
    generatedAt: Date,
  ): DraftRisk[] {
    const grouped =
      new Map<
        string,
        PredictiveRiskOpportunityInput[]
      >();

    for (
      const opportunity
      of context.opportunities
    ) {
      if (!opportunity.isOpen) {
        continue;
      }

      const ownerId =
        opportunity.ownerId
        ?? "unassigned";

      const current =
        grouped.get(ownerId)
        ?? [];

      current.push(
        opportunity,
      );

      grouped.set(
        ownerId,
        current,
      );
    }

    const risks:
      DraftRisk[] = [];

    for (
      const [ownerId, opportunities]
      of grouped
    ) {
      const staleCount =
        opportunities.filter(
          (opportunity) => {
            const inactivity =
              opportunity
                .daysSinceLastActivity
              ?? resolveDaysBetween(
                opportunity.lastActivityAt,
                generatedAt,
                999,
              );

            return (
              inactivity
              >= this.configuration
                .staleActivityDays
            );
          },
        ).length;

      const overdueActions =
        opportunities.reduce(
          (total, opportunity) =>
            total
            + (
              opportunity
                .overdueActionCount
              ?? 0
            ),
          0,
        );

      const averageRisk =
        opportunities.reduce(
          (total, opportunity) =>
            total
            + (
              opportunity.riskScore
              ?? 30
            ),
          0,
        )
        / opportunities.length;

      const ownerRiskScore =
        clampPredictiveRiskScore(
          averageRisk * 0.5
          + (
            staleCount
            / opportunities.length
          ) * 30
          + Math.min(
            20,
            overdueActions * 2,
          ),
        );

      if (ownerRiskScore < 45) {
        continue;
      }

      const amountAtRisk =
        opportunities.reduce(
          (total, opportunity) =>
            total
            + resolvePredictiveWeightedAmount(
              opportunity.amount,
              opportunity.weightedAmount,
              opportunity.winProbability,
              opportunity.stageProbability,
            ),
          0,
        );

      risks.push({
        scope: "owner",
        category:
          "owner-performance",

        severity:
          resolvePredictiveRiskSeverity(
            ownerRiskScore,
            this.configuration,
          ),

        title:
          "Owner portfolio execution risk",

        description:
          `The active portfolio for owner "${ownerId}" shows elevated risk across opportunity quality, inactivity, or overdue execution.`,

        probabilityScore:
          ownerRiskScore,

        impactScore:
          this.calculateAmountImpactScore(
            amountAtRisk,
          ),

        riskScore:
          ownerRiskScore,

        confidenceScore: 85,

        amountAtRisk:
          roundPredictiveRiskNumber(
            amountAtRisk,
          ),

        expectedLoss:
          roundPredictiveRiskNumber(
            amountAtRisk
            * (
              ownerRiskScore / 100
            )
            * 0.45,
          ),

        ownerId,

        opportunityIds:
          opportunities.map(
            (opportunity) =>
              opportunity.opportunityId,
          ),

        evidence: [
          this.evidence(
            "portfolio-size",
            "Open opportunity count",
            opportunities.length,
            0.2,
            "neutral",
          ),

          this.evidence(
            "stale-count",
            "Stale opportunity count",
            staleCount,
            0.3,
            "increases-risk",
          ),

          this.evidence(
            "overdue-actions",
            "Overdue action count",
            overdueActions,
            0.25,
            "increases-risk",
          ),

          this.evidence(
            "average-risk",
            "Average opportunity risk",
            roundPredictiveRiskNumber(
              averageRisk,
            ),
            0.25,
            "increases-risk",
          ),
        ],

        recommendedAction:
          "Initiate manager coaching, portfolio inspection, and accountable recovery plans.",

        mitigationDeadline:
          this.addDays(
            generatedAt,
            5,
          ),
      });
    }

    return risks;
  }

  private detectDataQualityRisks(
    context: PredictiveRiskContext,
  ): DraftRisk[] {
    const open =
      context.opportunities.filter(
        (opportunity) =>
          opportunity.isOpen,
      );

    if (open.length === 0) {
      return [];
    }

    const missingCloseDate =
      open.filter(
        (opportunity) =>
          !opportunity.expectedCloseDate,
      );

    const missingOwner =
      open.filter(
        (opportunity) =>
          !opportunity.ownerId,
      );

    const missingProbability =
      open.filter(
        (opportunity) =>
          opportunity.winProbability
            === undefined
          && opportunity.stageProbability
            === undefined,
      );

    const incomplete =
      new Set(
        [
          ...missingCloseDate,
          ...missingOwner,
          ...missingProbability,
        ].map(
          (opportunity) =>
            opportunity.opportunityId,
        ),
      );

    const incompleteRatio =
      incomplete.size
      / open.length;

    if (incompleteRatio < 0.2) {
      return [];
    }

    const probabilityScore =
      clampPredictiveRiskScore(
        incompleteRatio * 100,
      );

    const riskScore =
      this.combineRiskScores(
        probabilityScore,
        55,
      );

    return [
      {
        scope: "workspace",
        category:
          "data-quality",

        severity:
          resolvePredictiveRiskSeverity(
            riskScore,
            this.configuration,
          ),

        title:
          "Revenue intelligence data quality risk",

        description:
          `${incomplete.size} open opportunities have missing ownership, close-date, or probability data.`,

        probabilityScore,
        impactScore: 55,
        riskScore,

        confidenceScore: 98,

        opportunityIds:
          Array.from(incomplete),

        evidence: [
          this.evidence(
            "missing-close-date",
            "Missing close date count",
            missingCloseDate.length,
            0.4,
            "increases-risk",
          ),

          this.evidence(
            "missing-owner",
            "Missing owner count",
            missingOwner.length,
            0.3,
            "increases-risk",
          ),

          this.evidence(
            "missing-probability",
            "Missing probability count",
            missingProbability.length,
            0.3,
            "increases-risk",
          ),
        ],

        recommendedAction:
          "Require mandatory ownership, close-date, probability, and activity data before forecast inclusion.",
      },
    ];
  }

  private buildRecommendations(
    risks:
      readonly PredictiveRiskDetection[],
  ): readonly PredictiveRiskRecommendation[] {
    const recommendations:
      PredictiveRiskRecommendation[] = [];

    for (
      const risk
      of risks
    ) {
      recommendations.push({
        id: "",

        priority:
          risk.severity,

        scope:
          risk.scope,

        title:
          risk.recommendedAction
          ?? `Address ${risk.title}`,

        description:
          risk.description,

        rationale:
          `${risk.title} has a predictive risk score of ${risk.riskScore}.`,

        expectedImpact:
          this.resolveExpectedImpact(
            risk.scope,
          ),

        actionType:
          this.resolveActionType(
            risk.category,
          ),

        opportunityIds:
          risk.opportunityIds,

        ownerIds:
          risk.ownerId
            ? [risk.ownerId]
            : undefined,
      });
    }

    const seen =
      new Set<string>();

    return recommendations
      .filter(
        (recommendation) => {
          const key =
            `${recommendation.actionType}:${recommendation.title}`;

          if (seen.has(key)) {
            return false;
          }

          seen.add(key);

          return true;
        },
      )
      .sort(
        (left, right) =>
          predictiveRiskSeverityWeight[
            right.priority
          ]
          - predictiveRiskSeverityWeight[
            left.priority
          ],
      )
      .slice(
        0,
        this.configuration
          .maximumRecommendations,
      );
  }

  private calculateOverallRiskScore(
    risks:
      readonly PredictiveRiskDetection[],
  ): number {
    if (risks.length === 0) {
      return 0;
    }

    const weightedTotal =
      risks.reduce(
        (total, risk) =>
          total
          + risk.riskScore
          * predictiveRiskSeverityWeight[
            risk.severity
          ],
        0,
      );

    const totalWeight =
      risks.reduce(
        (total, risk) =>
          total
          + predictiveRiskSeverityWeight[
            risk.severity
          ],
        0,
      );

    const criticalPenalty =
      risks.filter(
        (risk) =>
          risk.severity === "critical",
      ).length * 4;

    return roundPredictiveRiskNumber(
      clampPredictiveRiskScore(
        weightedTotal
        / Math.max(
          1,
          totalWeight,
        )
        + criticalPenalty,
      ),
    );
  }

  private buildSummary(
    overallRiskScore: number,
    overallSeverity:
      PredictiveRiskAssessment["overallSeverity"],
    risks:
      readonly PredictiveRiskDetection[],
    recommendations:
      readonly PredictiveRiskRecommendation[],
    totalAmountAtRisk: number,
  ): PredictiveRiskSummary {
    const primaryRisk =
      risks[0];

    let riskPosture:
      PredictiveRiskSummary["riskPosture"];

    switch (overallSeverity) {
      case "critical":
        riskPosture = "critical";
        break;

      case "high":
        riskPosture = "high";
        break;

      case "medium":
        riskPosture = "elevated";
        break;

      case "low":
      default:
        riskPosture = "controlled";
        break;
    }

    const headline =
      riskPosture === "critical"
        ? "Revenue risk requires immediate executive intervention."
        : riskPosture === "high"
          ? "Revenue risk requires active management action."
          : riskPosture === "elevated"
            ? "Revenue risk is elevated but manageable."
            : "Revenue risk is currently controlled.";

    const narrativeParts = [
      `Overall predictive risk score is ${overallRiskScore}.`,
      `Total identified amount at risk is ${totalAmountAtRisk}.`,
    ];

    if (primaryRisk) {
      narrativeParts.push(
        `Primary risk: ${primaryRisk.title}.`,
      );
    }

    if (recommendations[0]) {
      narrativeParts.push(
        `Priority action: ${recommendations[0].title}.`,
      );
    }

    return {
      headline,

      narrative:
        narrativeParts.join(" "),

      riskPosture,

      primaryRisk:
        primaryRisk?.title,

      primaryExposure:
        primaryRisk?.amountAtRisk,

      priorityAction:
        recommendations[0]?.title,
    };
  }

  private calculateDealLossRisk(
    opportunity:
      PredictiveRiskOpportunityInput,
  ): number {
    const explicitRisk =
      opportunity.riskScore
      ?? 30;

    const probabilityRisk =
      100
      - (
        opportunity.winProbability
        ?? opportunity.stageProbability
        ?? 50
      );

    const momentumRisk =
      100
      - (
        opportunity.momentumScore
        ?? 50
      );

    const stakeholderRisk =
      this.calculateStakeholderRisk(
        opportunity,
      );

    const competitionRisk =
      Math.min(
        100,
        (
          opportunity.competitorCount
          ?? 0
        ) * 18,
      );

    const regressionRisk =
      Math.min(
        100,
        (
          opportunity.stageRegressionCount
          ?? 0
        ) * 25
        + (
          opportunity.closeDateChangeCount
          ?? 0
        ) * 10,
      );

    return roundPredictiveRiskNumber(
      clampPredictiveRiskScore(
        explicitRisk * 0.3
        + probabilityRisk * 0.25
        + momentumRisk * 0.15
        + stakeholderRisk * 0.15
        + competitionRisk * 0.05
        + regressionRisk * 0.1,
      ),
    );
  }

  private calculateStakeholderRisk(
    opportunity:
      PredictiveRiskOpportunityInput,
  ): number {
    let risk = 0;

    if (
      (
        opportunity.stakeholderCount
        ?? 0
      ) < 2
    ) {
      risk += 25;
    }

    if (
      !opportunity
        .decisionMakerConfirmed
    ) {
      risk += 25;
    }

    if (
      !opportunity
        .economicBuyerConfirmed
    ) {
      risk += 25;
    }

    if (
      !opportunity
        .championConfirmed
    ) {
      risk += 20;
    }

    return clampPredictiveRiskScore(
      risk,
    );
  }

  private calculateExecutionRisk(
    opportunity:
      PredictiveRiskOpportunityInput,
  ): number {
    const overdueRisk =
      Math.min(
        40,
        (
          opportunity.overdueActionCount
          ?? 0
        ) * 10,
      );

    const closeDateRisk =
      Math.min(
        25,
        (
          opportunity.closeDateChangeCount
          ?? 0
        ) * 8,
      );

    const amountChangeRisk =
      Math.min(
        15,
        (
          opportunity.amountChangeCount
          ?? 0
        ) * 5,
      );

    const momentumRisk =
      Math.max(
        0,
        50
        - (
          opportunity.momentumScore
          ?? 50
        ),
      );

    const sentimentRisk =
      Math.max(
        0,
        50
        - (
          opportunity
            .customerSentimentScore
          ?? 50
        ),
      );

    return clampPredictiveRiskScore(
      overdueRisk
      + closeDateRisk
      + amountChangeRisk
      + momentumRisk * 0.25
      + sentimentRisk * 0.2,
    );
  }

  private calculateAmountImpactScore(
    amount: number,
  ): number {
    if (amount >= 1_000_000) {
      return 100;
    }

    if (amount >= 500_000) {
      return 90;
    }

    if (amount >= 250_000) {
      return 80;
    }

    if (amount >= 100_000) {
      return 70;
    }

    if (amount >= 50_000) {
      return 60;
    }

    if (amount >= 10_000) {
      return 45;
    }

    return 30;
  }

  private combineRiskScores(
    probabilityScore: number,
    impactScore: number,
  ): number {
    return roundPredictiveRiskNumber(
      clampPredictiveRiskScore(
        probabilityScore * 0.6
        + impactScore * 0.4,
      ),
    );
  }

  private evidence(
    key: string,
    label: string,
    value:
      | string
      | number
      | boolean,
    weight: number,
    direction:
      PredictiveRiskEvidence["direction"],
  ): PredictiveRiskEvidence {
    return {
      key,
      label,
      value,
      weight,
      direction,
    };
  }

  private resolveExpectedImpact(
    scope: PredictiveRiskScope,
  ): string {
    const impacts:
      Record<
        PredictiveRiskScope,
        string
      > = {
        opportunity:
          "Reduce deal loss and slippage probability.",

        owner:
          "Improve portfolio execution and seller accountability.",

        pipeline:
          "Improve pipeline resilience, quality, and target coverage.",

        forecast:
          "Increase forecast confidence and planning reliability.",

        revenue:
          "Protect expected revenue and improve target attainment.",

        workspace:
          "Improve revenue intelligence data quality and system reliability.",
      };

    return impacts[scope];
  }

  private resolveActionType(
    category:
      PredictiveRiskDetection["category"],
  ): PredictiveRiskRecommendation["actionType"] {
    switch (category) {
      case "opportunity-inactivity":
        return "engage-customer";

      case "deal-loss":
      case "stage-stagnation":
      case "stakeholder-risk":
      case "execution-risk":
        return "review-opportunity";

      case "deal-slippage":
        return "requalify";

      case "forecast-instability":
      case "revenue-shortfall":
        return "reforecast";

      case "pipeline-coverage":
      case "pipeline-concentration":
        return "create-pipeline";

      case "owner-performance":
        return "manager-coaching";

      case "data-quality":
        return "data-remediation";

      default:
        return "executive-intervention";
    }
  }

  private countSeverity(
    risks:
      readonly PredictiveRiskDetection[],
    severity:
      PredictiveRiskDetection["severity"],
  ): number {
    return risks.filter(
      (risk) =>
        risk.severity === severity,
    ).length;
  }

  private countScope(
    risks:
      readonly PredictiveRiskDetection[],
    scope:
      PredictiveRiskDetection["scope"],
  ): number {
    return risks.filter(
      (risk) =>
        risk.scope === scope,
    ).length;
  }

  private addDays(
    date: Date,
    days: number,
  ): string {
    return new Date(
      date.getTime()
      + days
      * 24
      * 60
      * 60
      * 1000,
    ).toISOString();
  }

  private validateContext(
    context: PredictiveRiskContext,
  ): void {
    if (!context.tenantId.trim()) {
      throw new Error(
        "Predictive risk detection requires a tenantId.",
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
        "Predictive risk periodStart is invalid.",
      );
    }

    if (
      Number.isNaN(
        periodEnd.getTime(),
      )
    ) {
      throw new Error(
        "Predictive risk periodEnd is invalid.",
      );
    }

    if (
      periodEnd <= periodStart
    ) {
      throw new Error(
        "Predictive risk periodEnd must be after periodStart.",
      );
    }

    for (
      const opportunity
      of context.opportunities
    ) {
      if (
        opportunity.tenantId
        !== context.tenantId
      ) {
        throw new Error(
          `Opportunity "${opportunity.opportunityId}" belongs to another tenant.`,
        );
      }

      if (
        context.workspaceId
        && opportunity.workspaceId
        && opportunity.workspaceId
          !== context.workspaceId
      ) {
        throw new Error(
          `Opportunity "${opportunity.opportunityId}" belongs to another workspace.`,
        );
      }

      if (
        !opportunity.opportunityId.trim()
      ) {
        throw new Error(
          "Predictive risk detection received an opportunity without an opportunityId.",
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

export const createPredictiveRiskEngine = (
  dependencies:
    PredictiveRiskEngineDependencies = {},
): PredictiveRiskEngine =>
  new PredictiveRiskEngine(
    dependencies,
  );

