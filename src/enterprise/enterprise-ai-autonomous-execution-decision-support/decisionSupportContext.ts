import type { DecisionUrgency } from "./decisionSupportTypes";
import type { DecisionOption } from "./decisionOption";

export interface DecisionSupportContext {
  readonly decisionId: string;
  readonly objective: string;
  readonly urgency: DecisionUrgency;
  readonly options: readonly DecisionOption[];
  readonly availableSignals?: readonly string[];
  readonly knownConstraints?: readonly string[];
  readonly requiredOutcome?: string;
}