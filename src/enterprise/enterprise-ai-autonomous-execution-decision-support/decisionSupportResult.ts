import type {
  DecisionConfidenceLevel,
  DecisionRiskLevel,
  DecisionSupportStatus,
} from "./decisionSupportTypes";
import type { DecisionOption } from "./decisionOption";

export interface RankedDecisionOption extends DecisionOption {
  readonly decisionScore: number;
  readonly rankingReason: string;
}

export interface DecisionSupportResult {
  readonly decisionId: string;
  readonly status: DecisionSupportStatus;
  readonly recommendedOption?: RankedDecisionOption;
  readonly rankedOptions: readonly RankedDecisionOption[];
  readonly overallRiskLevel: DecisionRiskLevel;
  readonly confidenceLevel: DecisionConfidenceLevel;
  readonly reasoning: readonly string[];
  readonly executiveSummary: string;
}