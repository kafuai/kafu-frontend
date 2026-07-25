import type {
  AIRecommendation,
  AIRecommendationCandidate,
  AIRecommendationConfiguration,
  AIRecommendationContext,
  AIRecommendationGenerationResult,
  AIRecommendationPriority,
  AIRecommendationQueueSummary,
} from "./AIRecommendationRuntimeTypes";

const DEFAULT_CONFIGURATION:
  AIRecommendationConfiguration = {
    modelVersion: "5.0.0",

    defaultExpirationHours: 168,
    criticalExpirationHours: 24,
    highExpirationHours: 72,

    maximumRecommendationsPerRun: 100,

    duplicateWindowHours: 72,
    materialConfidenceThreshold: 45,

    criticalScoreThreshold: 80,
    highScoreThreshold: 65,
    mediumScoreThreshold: 40,
  };

export interface AIRecommendationRuntimeEngineDependencies {
  configuration?:
    Partial<AIRecommendationConfiguration>;
}

interface ScoredCandidate {
  candidate: AIRecommendationCandidate;

  recommendationScore: number;
  confidenceScore: number;
  urgencyScore: number;
  impactScore: number;
  riskScore: number;

  priority: AIRecommendationPriority;

  deduplicationKey: string;
}

export class AIRecommendationRuntimeEngine {
  private readonly configuration:
    AIRecommendationConfiguration;

  constructor(
    dependencies:
      AIRecommendationRuntimeEngineDependencies = {},
  ) {
    this.configuration = {
      ...DEFAULT_CONFIGURATION,
      ...dependencies.configuration,
    };
  }

  generate(
    context: AIRecommendationContext,
    generatedAt = new Date(),
  ): AIRecommendationGenerationResult {
    this.validateContext(context);

    const validCandidates =
      context.candidates.filter(
        (candidate) =>
          this.isValidCandidate(
            candidate,
            context,
          ),
      );

    const scored =
      validCandidates.map(
        (candidate) =>
          this.scoreCandidate(
            candidate,
          ),
      );

    const deduplicated =
      this.deduplicate(scored);

    const selected =
      deduplicated
        .sort(
          (left, right) =>
            right.recommendationScore
            - left.recommendationScore,
        )
        .slice(
          0,
          this.configuration
            .maximumRecommendationsPerRun,
        );

    const recommendations =
      selected.map(
        (item) =>
          this.createRecommendation(
            item,
            context,
            generatedAt,
          ),
      );

    return {
      tenantId:
        context.tenantId,

      workspaceId:
        context.workspaceId,

      generatedAt:
        generatedAt.toISOString(),

      receivedCandidateCount:
        context.candidates.length,

      deduplicatedCandidateCount:
        recommendations.length,

      rejectedCandidateCount:
        context.candidates.length
        - validCandidates.length,

      recommendations,

      summary:
        this.buildSummary(
          recommendations,
        ),
    };
  }

  private scoreCandidate(
    candidate:
      AIRecommendationCandidate,
  ): ScoredCandidate {
    const confidenceScore =
      this.clamp(
        candidate.confidenceScore
        ?? 70,
      );

    const urgencyScore =
      this.clamp(
        candidate.urgencyScore
        ?? this.resolveDefaultUrgency(
          candidate,
        ),
      );

    const impactScore =
      this.clamp(
        candidate.impactScore
        ?? this.resolveDefaultImpact(
          candidate,
        ),
      );

    const riskScore =
      this.clamp(
        candidate.riskScore
        ?? this.resolveDefaultRisk(
          candidate,
        ),
      );

    const recommendationScore =
      this.round(
        this.clamp(
          confidenceScore * 0.2
          + urgencyScore * 0.3
          + impactScore * 0.3
          + riskScore * 0.2,
        ),
      );

    return {
      candidate,

      recommendationScore,
      confidenceScore,
      urgencyScore,
      impactScore,
      riskScore,

      priority:
        candidate.priority
        ?? this.resolvePriority(
          recommendationScore,
        ),

      deduplicationKey:
        candidate.deduplicationKey
        ?? this.createDeduplicationKey(
          candidate,
        ),
    };
  }

  private createRecommendation(
    item: ScoredCandidate,
    context: AIRecommendationContext,
    generatedAt: Date,
  ): AIRecommendation {
    const expirationHours =
      this.resolveExpirationHours(
        item.priority,
      );

    const expiresAt =
      new Date(
        generatedAt.getTime()
        + expirationHours
        * 60
        * 60
        * 1000,
      );

    const dueAt =
      item.candidate.recommendedDueAt
        ? this.normalizeFutureDate(
          item.candidate
            .recommendedDueAt,
          generatedAt,
          expiresAt,
        )
        : this.resolveDueAt(
          item.priority,
          generatedAt,
          expiresAt,
        );

    return {
      id: "",

      tenantId:
        context.tenantId,

      workspaceId:
        context.workspaceId,

      source:
        item.candidate.source,

      sourceId:
        item.candidate.sourceId,

      category:
        item.candidate.category,

      scope:
        item.candidate.scope,

      audience:
        item.candidate.audience,

      actionType:
        item.candidate.actionType,

      priority:
        item.priority,

      status: "pending",

      title:
        item.candidate.title.trim(),

      description:
        item.candidate.description.trim(),

      rationale:
        item.candidate.rationale.trim(),

      expectedImpact:
        item.candidate.expectedImpact.trim(),

      recommendationScore:
        item.recommendationScore,

      confidenceScore:
        item.confidenceScore,

      urgencyScore:
        item.urgencyScore,

      impactScore:
        item.impactScore,

      riskScore:
        item.riskScore,

      amountAtRisk:
        this.normalizeOptionalAmount(
          item.candidate.amountAtRisk,
        ),

      expectedRevenueImpact:
        this.normalizeOptionalAmount(
          item.candidate
            .expectedRevenueImpact,
        ),

      opportunityId:
        item.candidate.opportunityId,

      opportunityIds:
        this.normalizeIds(
          item.candidate.opportunityIds,
          item.candidate.opportunityId,
        ),

      ownerId:
        item.candidate.ownerId,

      ownerIds:
        this.normalizeIds(
          item.candidate.ownerIds,
          item.candidate.ownerId,
        ),

      accountId:
        item.candidate.accountId,

      periodStart:
        item.candidate.periodStart
        ?? context.periodStart,

      periodEnd:
        item.candidate.periodEnd
        ?? context.periodEnd,

      generatedAt:
        generatedAt.toISOString(),

      dueAt:
        dueAt.toISOString(),

      expiresAt:
        expiresAt.toISOString(),

      deduplicationKey:
        item.deduplicationKey,

      evidence:
        item.candidate.evidence
        ?? [],

      modelVersion:
        this.configuration.modelVersion,

      correlationId:
        context.correlationId,

      metadata: {
        ...context.metadata,
        ...item.candidate.metadata,

        generationReason:
          context.reason,

        requestedBy:
          context.requestedBy,
      },
    };
  }

  private deduplicate(
    candidates:
      readonly ScoredCandidate[],
  ): ScoredCandidate[] {
    const selected =
      new Map<
        string,
        ScoredCandidate
      >();

    for (
      const candidate
      of candidates
    ) {
      const existing =
        selected.get(
          candidate.deduplicationKey,
        );

      if (
        !existing
        || candidate.recommendationScore
          > existing.recommendationScore
      ) {
        selected.set(
          candidate.deduplicationKey,
          candidate,
        );
      }
    }

    return Array.from(
      selected.values(),
    );
  }

  private buildSummary(
    recommendations:
      readonly AIRecommendation[],
  ): AIRecommendationQueueSummary {
    const countStatus = (
      status:
        AIRecommendation["status"],
    ): number =>
      recommendations.filter(
        (recommendation) =>
          recommendation.status === status,
      ).length;

    const countPriority = (
      priority:
        AIRecommendation["priority"],
    ): number =>
      recommendations.filter(
        (recommendation) =>
          recommendation.priority
          === priority,
      ).length;

    const primary =
      recommendations[0];

    return {
      total:
        recommendations.length,

      pending:
        countStatus("pending"),

      assigned:
        countStatus("assigned"),

      accepted:
        countStatus("accepted"),

      inProgress:
        countStatus("in-progress"),

      completed:
        countStatus("completed"),

      dismissed:
        countStatus("dismissed"),

      expired:
        countStatus("expired"),

      failed:
        countStatus("failed"),

      critical:
        countPriority("critical"),

      high:
        countPriority("high"),

      medium:
        countPriority("medium"),

      low:
        countPriority("low"),

      totalAmountAtRisk:
        this.round(
          recommendations.reduce(
            (total, recommendation) =>
              total
              + (
                recommendation
                  .amountAtRisk
                ?? 0
              ),
            0,
          ),
        ),

      expectedRevenueImpact:
        this.round(
          recommendations.reduce(
            (total, recommendation) =>
              total
              + (
                recommendation
                  .expectedRevenueImpact
                ?? 0
              ),
            0,
          ),
        ),

      managementAttentionRequired:
        recommendations.some(
          (recommendation) =>
            recommendation.priority
            === "critical",
        )
        || recommendations.filter(
          (recommendation) =>
            recommendation.priority
            === "high",
        ).length >= 3,

      primaryRecommendationId:
        primary?.id,

      primaryRecommendationTitle:
        primary?.title,
    };
  }

  private resolvePriority(
    score: number,
  ): AIRecommendationPriority {
    if (
      score
      >= this.configuration
        .criticalScoreThreshold
    ) {
      return "critical";
    }

    if (
      score
      >= this.configuration
        .highScoreThreshold
    ) {
      return "high";
    }

    if (
      score
      >= this.configuration
        .mediumScoreThreshold
    ) {
      return "medium";
    }

    return "low";
  }

  private resolveDefaultUrgency(
    candidate:
      AIRecommendationCandidate,
  ): number {
    switch (candidate.priority) {
      case "critical":
        return 100;

      case "high":
        return 80;

      case "medium":
        return 55;

      case "low":
        return 25;

      default:
        break;
    }

    switch (candidate.actionType) {
      case "intervene":
      case "mitigate-risk":
        return 85;

      case "engage-customer":
      case "reforecast":
      case "accelerate":
        return 75;

      case "requalify":
      case "create-pipeline":
      case "close-action":
        return 65;

      case "coach":
      case "update-data":
        return 50;

      case "review":
      case "monitor":
      default:
        return 35;
    }
  }

  private resolveDefaultImpact(
    candidate:
      AIRecommendationCandidate,
  ): number {
    const amount =
      Math.max(
        candidate.amountAtRisk
        ?? 0,
        candidate.expectedRevenueImpact
        ?? 0,
      );

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

    switch (candidate.scope) {
      case "workspace":
      case "revenue-period":
        return 85;

      case "pipeline":
      case "forecast":
        return 75;

      case "owner":
      case "account":
        return 60;

      case "opportunity":
      default:
        return 50;
    }
  }

  private resolveDefaultRisk(
    candidate:
      AIRecommendationCandidate,
  ): number {
    switch (candidate.category) {
      case "risk":
        return 85;

      case "revenue":
      case "forecast":
        return 75;

      case "pipeline":
      case "opportunity":
        return 65;

      case "customer-engagement":
        return 60;

      case "sales-coaching":
      case "operations":
        return 50;

      case "data-quality":
        return 45;

      case "strategy":
      default:
        return 55;
    }
  }

  private resolveExpirationHours(
    priority:
      AIRecommendationPriority,
  ): number {
    if (priority === "critical") {
      return this.configuration
        .criticalExpirationHours;
    }

    if (priority === "high") {
      return this.configuration
        .highExpirationHours;
    }

    return this.configuration
      .defaultExpirationHours;
  }

  private resolveDueAt(
    priority:
      AIRecommendationPriority,
    generatedAt: Date,
    expiresAt: Date,
  ): Date {
    const hours =
      priority === "critical"
        ? 4
        : priority === "high"
          ? 24
          : priority === "medium"
            ? 72
            : 120;

    const dueAt =
      new Date(
        generatedAt.getTime()
        + hours
        * 60
        * 60
        * 1000,
      );

    return dueAt < expiresAt
      ? dueAt
      : expiresAt;
  }

  private normalizeFutureDate(
    value: string,
    generatedAt: Date,
    expiresAt: Date,
  ): Date {
    const parsed =
      new Date(value);

    if (
      Number.isNaN(
        parsed.getTime(),
      )
      || parsed <= generatedAt
    ) {
      return generatedAt;
    }

    return parsed <= expiresAt
      ? parsed
      : expiresAt;
  }

  private createDeduplicationKey(
    candidate:
      AIRecommendationCandidate,
  ): string {
    const subject =
      candidate.opportunityId
      ?? candidate.ownerId
      ?? candidate.accountId
      ?? candidate.scope;

    return [
      candidate.source,
      candidate.category,
      candidate.actionType,
      subject,
      this.normalizeKeyText(
        candidate.title,
      ),
    ].join(":");
  }

  private normalizeKeyText(
    value: string,
  ): string {
    return value
      .trim()
      .toLowerCase()
      .replace(
        /[^a-z0-9\u0600-\u06ff]+/g,
        "-",
      )
      .replace(
        /^-+|-+$/g,
        "",
      )
      .slice(0, 80);
  }

  private normalizeIds(
    ids:
      readonly string[]
      | undefined,
    singleId:
      string
      | undefined,
  ): readonly string[] | undefined {
    const values =
      [
        ...(ids ?? []),
        ...(singleId
          ? [singleId]
          : []),
      ]
        .map(
          (value) =>
            value.trim(),
        )
        .filter(Boolean);

    if (values.length === 0) {
      return undefined;
    }

    return Array.from(
      new Set(values),
    );
  }

  private normalizeOptionalAmount(
    value:
      number
      | undefined,
  ): number | undefined {
    if (
      value === undefined
      || !Number.isFinite(value)
    ) {
      return undefined;
    }

    return this.round(
      Math.max(0, value),
    );
  }

  private isValidCandidate(
    candidate:
      AIRecommendationCandidate,
    context:
      AIRecommendationContext,
  ): boolean {
    if (
      candidate.tenantId
      !== context.tenantId
    ) {
      return false;
    }

    if (
      context.workspaceId
      && candidate.workspaceId
      && candidate.workspaceId
        !== context.workspaceId
    ) {
      return false;
    }

    if (
      !candidate.title.trim()
      || !candidate.description.trim()
      || !candidate.rationale.trim()
      || !candidate.expectedImpact.trim()
    ) {
      return false;
    }

    const confidence =
      candidate.confidenceScore
      ?? 70;

    if (
      confidence
      < this.configuration
        .materialConfidenceThreshold
    ) {
      return false;
    }

    return true;
  }

  private validateContext(
    context:
      AIRecommendationContext,
  ): void {
    if (!context.tenantId.trim()) {
      throw new Error(
        "AI recommendation runtime requires a tenantId.",
      );
    }

    if (
      !Array.isArray(
        context.candidates,
      )
    ) {
      throw new Error(
        "AI recommendation candidates must be an array.",
      );
    }

    for (
      const candidate
      of context.candidates
    ) {
      if (
        candidate.tenantId
        !== context.tenantId
      ) {
        throw new Error(
          "AI recommendation candidate belongs to another tenant.",
        );
      }

      if (
        candidate.amountAtRisk
          !== undefined
        && (
          !Number.isFinite(
            candidate.amountAtRisk,
          )
          || candidate.amountAtRisk < 0
        )
      ) {
        throw new Error(
          `Recommendation candidate "${candidate.title}" has an invalid amountAtRisk.`,
        );
      }

      if (
        candidate.expectedRevenueImpact
          !== undefined
        && (
          !Number.isFinite(
            candidate
              .expectedRevenueImpact,
          )
          || candidate
            .expectedRevenueImpact < 0
        )
      ) {
        throw new Error(
          `Recommendation candidate "${candidate.title}" has an invalid expectedRevenueImpact.`,
        );
      }
    }
  }

  private clamp(
    value: number,
  ): number {
    return Math.min(
      100,
      Math.max(0, value),
    );
  }

  private round(
    value: number,
  ): number {
    return Math.round(
      (
        value
        + Number.EPSILON
      ) * 100,
    ) / 100;
  }
}

export const createAIRecommendationRuntimeEngine = (
  dependencies:
    AIRecommendationRuntimeEngineDependencies = {},
): AIRecommendationRuntimeEngine =>
  new AIRecommendationRuntimeEngine(
    dependencies,
  );
