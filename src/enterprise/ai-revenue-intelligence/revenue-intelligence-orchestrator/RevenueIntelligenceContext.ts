import type {
  DealRiskAssessment,
  DealRiskContext,
} from "../deal-risk-detection";
import type {
  NextBestActionContext,
} from "../next-best-action";
import type {
  OpportunityScore,
  OpportunityScoringContext,
} from "../opportunity-scoring";
import type {
  RevenuePredictionForecast,
  RevenuePredictionContext,
} from "../revenue-prediction";
import type {
  SalesForecastContext,
  SalesForecastPeriod,
} from "../sales-forecast";
import type {
  WinProbabilityContext,
  WinProbabilityPrediction,
} from "../win-probability";
import type {
  RevenueIntelligenceOpportunityReference,
} from "./RevenueIntelligenceTypes";

export interface RevenueIntelligenceOpportunitySource {
  reference:
    RevenueIntelligenceOpportunityReference;

  opportunityScoringContext:
    OpportunityScoringContext;

  winProbabilityContext(input: {
    opportunityScore: OpportunityScore;
  }): WinProbabilityContext;

  revenuePredictionContext(input: {
    opportunityScore: OpportunityScore;
    winProbability: WinProbabilityPrediction;
  }): RevenuePredictionContext;

  dealRiskContext(input: {
    opportunityScore: OpportunityScore;
    winProbability: WinProbabilityPrediction;
    revenuePrediction: RevenuePredictionForecast;
  }): DealRiskContext;

  nextBestActionContext(input: {
    opportunityScore: OpportunityScore;
    winProbability: WinProbabilityPrediction;
    revenuePrediction: RevenuePredictionForecast;
    dealRisk: DealRiskAssessment;
  }): NextBestActionContext;
}

export interface RevenueIntelligenceContextProvider {
  getOpportunitySource(input: {
    tenantId: string;
    workspaceId?: string;
    opportunityId: string;
  }): Promise<RevenueIntelligenceOpportunitySource>;

  listOpportunitySources(input: {
    tenantId: string;
    workspaceId?: string;
    opportunityIds?: readonly string[];
    currency: string;
  }): Promise<
    readonly RevenueIntelligenceOpportunitySource[]
  >;

  getSalesForecastContext(input: {
    tenantId: string;
    workspaceId?: string;
    currency: string;
    period: SalesForecastPeriod;
    periodStart: string;
    periodEnd: string;
  }): Promise<SalesForecastContext>;
}

export class RevenueIntelligenceContextError
  extends Error {
  readonly code: string;
  readonly cause?: unknown;

  constructor(
    code: string,
    message: string,
    cause?: unknown,
  ) {
    super(message);

    this.name =
      "RevenueIntelligenceContextError";

    this.code = code;
    this.cause = cause;
  }
}

export const assertOpportunitySource = (
  source: RevenueIntelligenceOpportunitySource,
): RevenueIntelligenceOpportunitySource => {
  if (!source.reference.tenantId.trim()) {
    throw new RevenueIntelligenceContextError(
      "TENANT_REQUIRED",
      "Revenue intelligence opportunity source requires a tenantId.",
    );
  }

  if (!source.reference.opportunityId.trim()) {
    throw new RevenueIntelligenceContextError(
      "OPPORTUNITY_REQUIRED",
      "Revenue intelligence opportunity source requires an opportunityId.",
    );
  }

  if (!source.reference.currency.trim()) {
    throw new RevenueIntelligenceContextError(
      "CURRENCY_REQUIRED",
      "Revenue intelligence opportunity source requires a currency.",
    );
  }

  if (
    !Number.isFinite(
      source.reference.dealValue,
    )
    || source.reference.dealValue < 0
  ) {
    throw new RevenueIntelligenceContextError(
      "INVALID_DEAL_VALUE",
      "Revenue intelligence opportunity source requires a valid deal value.",
    );
  }

  return source;
};

