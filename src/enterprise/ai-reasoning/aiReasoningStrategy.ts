import { AIReasoningStrategy } from "./aiReasoningTypes";

export interface AIReasoningStrategyProfile {
  readonly strategy: AIReasoningStrategy;
  readonly description: string;
  readonly bestFor: readonly string[];
  readonly riskFactors: readonly string[];
}

export const AI_REASONING_STRATEGY_PROFILES: readonly AIReasoningStrategyProfile[] =
  [
    {
      strategy: "deductive",
      description: "Applies rules or known principles to reach a specific conclusion.",
      bestFor: ["policy checks", "compliance logic", "rule-based validation"],
      riskFactors: ["incomplete rules", "outdated assumptions"],
    },
    {
      strategy: "inductive",
      description: "Generalizes from observed patterns and repeated evidence.",
      bestFor: ["trend analysis", "learning insights", "pattern discovery"],
      riskFactors: ["small sample size", "biased observations"],
    },
    {
      strategy: "abductive",
      description: "Selects the most plausible explanation from incomplete evidence.",
      bestFor: ["diagnostics", "incident analysis", "root-cause reasoning"],
      riskFactors: ["missing evidence", "alternative explanations"],
    },
    {
      strategy: "analogical",
      description: "Uses similar historical situations to reason about a current problem.",
      bestFor: ["case comparison", "memory-based reasoning", "scenario matching"],
      riskFactors: ["weak similarity", "context drift"],
    },
    {
      strategy: "causal",
      description: "Connects actions, conditions, and outcomes through cause-effect logic.",
      bestFor: ["impact analysis", "dependency reasoning", "operational planning"],
      riskFactors: ["hidden variables", "unclear dependencies"],
    },
    {
      strategy: "counterfactual",
      description: "Evaluates what may happen if assumptions, actions, or constraints change.",
      bestFor: ["simulation", "risk reduction", "decision comparison"],
      riskFactors: ["unrealistic alternatives", "unsupported assumptions"],
    },
    {
      strategy: "probabilistic",
      description: "Reasons with uncertainty using likelihood, confidence, and risk.",
      bestFor: ["prediction", "forecasting", "uncertain decisions"],
      riskFactors: ["poor calibration", "volatile inputs"],
    },
  ];

export function getAIReasoningStrategyProfile(
  strategy: AIReasoningStrategy,
): AIReasoningStrategyProfile {
  const profile = AI_REASONING_STRATEGY_PROFILES.find(
    (item) => item.strategy === strategy,
  );

  if (!profile) {
    throw new Error(`Unsupported AI reasoning strategy: ${strategy}`);
  }

  return profile;
}