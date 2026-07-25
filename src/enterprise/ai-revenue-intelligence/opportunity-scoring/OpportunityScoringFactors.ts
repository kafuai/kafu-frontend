import {
  OpportunityScoringContext,
  OpportunityScoringFactorKey,
  OpportunityScoringFactorResult,
} from "./OpportunityScoringTypes";

export interface OpportunityScoringFactorDefinition {
  key: OpportunityScoringFactorKey;
  label: string;
  defaultWeight: number;
  evaluate(
    context: OpportunityScoringContext,
    weight: number,
  ): OpportunityScoringFactorResult;
}

const clamp = (
  value: number,
  minimum = 0,
  maximum = 100,
): number => Math.min(maximum, Math.max(minimum, value));

const normalizePercent = (
  value: number | null | undefined,
): number | null => {
  if (value === null || value === undefined || !Number.isFinite(value)) {
    return null;
  }

  return clamp(value <= 1 ? value * 100 : value);
};

const createUnavailableResult = (
  key: OpportunityScoringFactorKey,
  label: string,
  weight: number,
  reason: string,
): OpportunityScoringFactorResult => ({
  key,
  label,
  score: 0,
  normalizedScore: 0,
  weight,
  weightedScore: 0,
  confidence: 0,
  reason,
  evidence: [],
  available: false,
});

const createResult = (
  key: OpportunityScoringFactorKey,
  label: string,
  score: number,
  weight: number,
  confidence: number,
  reason: string,
  evidence: readonly string[],
): OpportunityScoringFactorResult => {
  const normalizedScore = clamp(score);

  return {
    key,
    label,
    score: normalizedScore,
    normalizedScore,
    weight,
    weightedScore: normalizedScore * weight,
    confidence: clamp(confidence),
    reason,
    evidence,
    available: true,
  };
};

const dealSizeFactor: OpportunityScoringFactorDefinition = {
  key: "dealSize",
  label: "Deal Size",
  defaultWeight: 0.08,
  evaluate(context, weight) {
    const amount = context.expectedRevenue ?? context.amount;

    if (amount === null || amount === undefined || amount < 0) {
      return createUnavailableResult(
        this.key,
        this.label,
        weight,
        "No reliable opportunity value is available.",
      );
    }

    const score =
      amount === 0
        ? 10
        : clamp(20 + Math.log10(Math.max(amount, 1)) * 15);

    return createResult(
      this.key,
      this.label,
      score,
      weight,
      70,
      "Opportunity value contributes to commercial priority.",
      [
        `Opportunity value: ${amount}`,
        context.currency
          ? `Currency: ${context.currency}`
          : "Currency was not provided.",
      ],
    );
  },
};

const companyFitFactor: OpportunityScoringFactorDefinition = {
  key: "companyFit",
  label: "Company Fit",
  defaultWeight: 0.12,
  evaluate(context, weight) {
    const score = normalizePercent(context.companyFitScore);

    if (score === null) {
      return createUnavailableResult(
        this.key,
        this.label,
        weight,
        "Company-fit evidence is unavailable.",
      );
    }

    return createResult(
      this.key,
      this.label,
      score,
      weight,
      85,
      score >= 70
        ? "The account strongly matches the target customer profile."
        : "The account has incomplete or weak target-profile alignment.",
      [`Company fit score: ${score.toFixed(1)}`],
    );
  },
};

const engagementFactor: OpportunityScoringFactorDefinition = {
  key: "engagement",
  label: "Engagement",
  defaultWeight: 0.13,
  evaluate(context, weight) {
    const explicitScore = normalizePercent(context.engagementScore);

    if (explicitScore !== null) {
      return createResult(
        this.key,
        this.label,
        explicitScore,
        weight,
        90,
        explicitScore >= 70
          ? "Customer engagement is consistently strong."
          : "Customer engagement requires improvement.",
        [`Engagement score: ${explicitScore.toFixed(1)}`],
      );
    }

    const activityCount = context.meaningfulActivityCount30Days
      ?? context.activityCount30Days;

    if (
      activityCount === null
      || activityCount === undefined
      || activityCount < 0
    ) {
      return createUnavailableResult(
        this.key,
        this.label,
        weight,
        "Engagement evidence is unavailable.",
      );
    }

    const score = clamp(activityCount * 10);

    return createResult(
      this.key,
      this.label,
      score,
      weight,
      65,
      activityCount >= 7
        ? "Recent activity indicates sustained opportunity engagement."
        : "Recent activity volume is below the preferred level.",
      [`Activities in the last 30 days: ${activityCount}`],
    );
  },
};

const decisionMakerCoverageFactor:
  OpportunityScoringFactorDefinition = {
    key: "decisionMakerCoverage",
    label: "Decision-Maker Coverage",
    defaultWeight: 0.12,
    evaluate(context, weight) {
      const score = normalizePercent(context.decisionMakerCoverage);

      if (score === null) {
        return createUnavailableResult(
          this.key,
          this.label,
          weight,
          "Decision-maker coverage is unavailable.",
        );
      }

      return createResult(
        this.key,
        this.label,
        score,
        weight,
        85,
        score >= 70
          ? "The buying committee has meaningful stakeholder coverage."
          : "Decision-maker access or stakeholder coverage is insufficient.",
        [`Decision-maker coverage: ${score.toFixed(1)}`],
      );
    },
  };

const responseVelocityFactor: OpportunityScoringFactorDefinition = {
  key: "responseVelocity",
  label: "Response Velocity",
  defaultWeight: 0.08,
  evaluate(context, weight) {
    const hours = context.responseVelocityHours;

    if (hours === null || hours === undefined || hours < 0) {
      return createUnavailableResult(
        this.key,
        this.label,
        weight,
        "Response-velocity evidence is unavailable.",
      );
    }

    const score =
      hours <= 4
        ? 100
        : hours <= 12
          ? 85
          : hours <= 24
            ? 70
            : hours <= 48
              ? 50
              : hours <= 96
                ? 30
                : 10;

    return createResult(
      this.key,
      this.label,
      score,
      weight,
      80,
      hours <= 24
        ? "Customer responses are arriving within a healthy timeframe."
        : "Slow response velocity may indicate declining buying intent.",
      [`Average response time: ${hours.toFixed(1)} hours`],
    );
  },
};

const activityFrequencyFactor:
  OpportunityScoringFactorDefinition = {
    key: "activityFrequency",
    label: "Activity Frequency",
    defaultWeight: 0.08,
    evaluate(context, weight) {
      const count = context.activityCount30Days;

      if (count === null || count === undefined || count < 0) {
        return createUnavailableResult(
          this.key,
          this.label,
          weight,
          "Recent activity frequency is unavailable.",
        );
      }

      const recencyPenalty =
        context.daysSinceLastActivity === null
        || context.daysSinceLastActivity === undefined
          ? 0
          : clamp(context.daysSinceLastActivity * 3, 0, 60);

      const score = clamp(count * 8 - recencyPenalty);

      return createResult(
        this.key,
        this.label,
        score,
        weight,
        75,
        score >= 65
          ? "The opportunity has a healthy interaction cadence."
          : "The opportunity interaction cadence is weak or stale.",
        [
          `Activities in the last 30 days: ${count}`,
          context.daysSinceLastActivity === null
          || context.daysSinceLastActivity === undefined
            ? "Last-activity age unavailable."
            : `Days since last activity: ${context.daysSinceLastActivity}`,
        ],
      );
    },
  };

const pipelineStageFactor: OpportunityScoringFactorDefinition = {
  key: "pipelineStage",
  label: "Pipeline Stage",
  defaultWeight: 0.1,
  evaluate(context, weight) {
    const probability = normalizePercent(context.stageProbability);

    if (probability !== null) {
      return createResult(
        this.key,
        this.label,
        probability,
        weight,
        85,
        "The configured stage probability represents current pipeline maturity.",
        [
          `Stage: ${context.stage ?? "Unknown"}`,
          `Stage probability: ${probability.toFixed(1)}`,
        ],
      );
    }

    if (!context.stage?.trim()) {
      return createUnavailableResult(
        this.key,
        this.label,
        weight,
        "Pipeline stage and stage probability are unavailable.",
      );
    }

    return createResult(
      this.key,
      this.label,
      50,
      weight,
      35,
      "A pipeline stage exists, but no calibrated stage probability is available.",
      [`Stage: ${context.stage}`],
    );
  },
};

const forecastConfidenceFactor:
  OpportunityScoringFactorDefinition = {
    key: "forecastConfidence",
    label: "Forecast Confidence",
    defaultWeight: 0.09,
    evaluate(context, weight) {
      const score = normalizePercent(context.forecastConfidence);

      if (score === null) {
        return createUnavailableResult(
          this.key,
          this.label,
          weight,
          "Forecast confidence is unavailable.",
        );
      }

      return createResult(
        this.key,
        this.label,
        score,
        weight,
        85,
        score >= 70
          ? "Forecast evidence supports a reliable revenue outcome."
          : "Forecast evidence remains uncertain.",
        [`Forecast confidence: ${score.toFixed(1)}`],
      );
    },
  };

const historicalWinRateFactor:
  OpportunityScoringFactorDefinition = {
    key: "historicalWinRate",
    label: "Historical Win Rate",
    defaultWeight: 0.07,
    evaluate(context, weight) {
      const score = normalizePercent(context.historicalWinRate);

      if (score === null) {
        return createUnavailableResult(
          this.key,
          this.label,
          weight,
          "Historical win-rate evidence is unavailable.",
        );
      }

      return createResult(
        this.key,
        this.label,
        score,
        weight,
        75,
        score >= 60
          ? "Historical outcomes support a favorable opportunity profile."
          : "Historical outcomes indicate a lower conversion profile.",
        [`Historical win rate: ${score.toFixed(1)}`],
      );
    },
  };

const competitorPressureFactor:
  OpportunityScoringFactorDefinition = {
    key: "competitorPressure",
    label: "Competitor Pressure",
    defaultWeight: 0.05,
    evaluate(context, weight) {
      const explicitPressure = normalizePercent(
        context.competitorPressureScore,
      );

      if (explicitPressure !== null) {
        const score = 100 - explicitPressure;

        return createResult(
          this.key,
          this.label,
          score,
          weight,
          80,
          explicitPressure <= 30
            ? "Competitive pressure is currently manageable."
            : "Competitive pressure is reducing win potential.",
          [
            `Competitor pressure: ${explicitPressure.toFixed(1)}`,
          ],
        );
      }

      const competitorCount = context.competitorCount;

      if (
        competitorCount === null
        || competitorCount === undefined
        || competitorCount < 0
      ) {
        return createUnavailableResult(
          this.key,
          this.label,
          weight,
          "Competitor pressure evidence is unavailable.",
        );
      }

      const score = clamp(100 - competitorCount * 18);

      return createResult(
        this.key,
        this.label,
        score,
        weight,
        55,
        competitorCount <= 1
          ? "Competitive pressure appears limited."
          : "Multiple competitors are increasing deal risk.",
        [`Known competitors: ${competitorCount}`],
      );
    },
  };

const executiveEngagementFactor:
  OpportunityScoringFactorDefinition = {
    key: "executiveEngagement",
    label: "Executive Engagement",
    defaultWeight: 0.04,
    evaluate(context, weight) {
      const score = normalizePercent(
        context.executiveEngagementScore,
      );

      if (score === null) {
        return createUnavailableResult(
          this.key,
          this.label,
          weight,
          "Executive-engagement evidence is unavailable.",
        );
      }

      return createResult(
        this.key,
        this.label,
        score,
        weight,
        80,
        score >= 70
          ? "Executive sponsorship is supporting opportunity momentum."
          : "Executive sponsorship is weak or absent.",
        [`Executive engagement score: ${score.toFixed(1)}`],
      );
    },
  };

const aiConfidenceFactor: OpportunityScoringFactorDefinition = {
  key: "aiConfidence",
  label: "AI Confidence",
  defaultWeight: 0.04,
  evaluate(context, weight) {
    const score = normalizePercent(context.aiConfidence);

    if (score === null) {
      return createUnavailableResult(
        this.key,
        this.label,
        weight,
        "AI confidence evidence is unavailable.",
      );
    }

    return createResult(
      this.key,
      this.label,
      score,
      weight,
      score,
      score >= 70
        ? "Available signals provide strong analytical confidence."
        : "The current opportunity evidence is incomplete or inconsistent.",
      [`AI confidence: ${score.toFixed(1)}`],
    );
  },
};

export const opportunityScoringFactors:
  readonly OpportunityScoringFactorDefinition[] = [
    dealSizeFactor,
    companyFitFactor,
    engagementFactor,
    decisionMakerCoverageFactor,
    responseVelocityFactor,
    activityFrequencyFactor,
    pipelineStageFactor,
    forecastConfidenceFactor,
    historicalWinRateFactor,
    competitorPressureFactor,
    executiveEngagementFactor,
    aiConfidenceFactor,
  ];

export const createOpportunityScoringFactors = (
  weightOverrides: Partial<
    Record<OpportunityScoringFactorKey, number>
  > = {},
): readonly OpportunityScoringFactorDefinition[] =>
  opportunityScoringFactors.map((factor) => ({
    ...factor,
    defaultWeight:
      weightOverrides[factor.key] ?? factor.defaultWeight,
  }));
