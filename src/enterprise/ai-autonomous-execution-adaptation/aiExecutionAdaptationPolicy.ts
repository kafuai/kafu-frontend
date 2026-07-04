import {
  AIExecutionAdaptationAction,
  AIExecutionAdaptationSeverity,
  AIExecutionAdaptationSignalType,
} from "./aiExecutionAdaptationTypes";
import {
  AIExecutionAdaptationSignal,
  isCriticalAIExecutionAdaptationSignal,
} from "./aiExecutionAdaptationSignal";

export interface AIExecutionAdaptationPolicyRule {
  signalType: AIExecutionAdaptationSignalType;
  minimumSeverity: AIExecutionAdaptationSeverity;
  action: AIExecutionAdaptationAction;
  reason: string;
}

export interface AIExecutionAdaptationPolicy {
  id: string;
  name: string;
  rules: AIExecutionAdaptationPolicyRule[];
  defaultAction: AIExecutionAdaptationAction;
}

const severityRank: Record<AIExecutionAdaptationSeverity, number> = {
  low: 1,
  medium: 2,
  high: 3,
  critical: 4,
};

export function createDefaultAIExecutionAdaptationPolicy(): AIExecutionAdaptationPolicy {
  return {
    id: "default-ai-execution-adaptation-policy",
    name: "Default AI Execution Adaptation Policy",
    defaultAction: "continue",
    rules: [
      {
        signalType: "performance_degradation",
        minimumSeverity: "medium",
        action: "rebalance",
        reason: "Performance degradation requires execution load rebalancing.",
      },
      {
        signalType: "risk_increase",
        minimumSeverity: "high",
        action: "increase_validation",
        reason: "High risk requires additional validation before continuation.",
      },
      {
        signalType: "execution_delay",
        minimumSeverity: "medium",
        action: "reprioritize",
        reason: "Execution delay requires priority adjustment.",
      },
      {
        signalType: "recovery_repeat",
        minimumSeverity: "high",
        action: "retry_with_adjustment",
        reason: "Repeated recovery requires adjusted retry behavior.",
      },
      {
        signalType: "resilience_threshold_breach",
        minimumSeverity: "critical",
        action: "escalate",
        reason: "Critical resilience breach requires escalation.",
      },
    ],
  };
}

export function resolveAIExecutionAdaptationPolicyAction(
  signal: AIExecutionAdaptationSignal,
  policy: AIExecutionAdaptationPolicy,
): AIExecutionAdaptationAction {
  if (isCriticalAIExecutionAdaptationSignal(signal)) {
    const criticalRule = policy.rules.find(
      (rule) =>
        rule.signalType === signal.type &&
        severityRank[signal.severity] >= severityRank[rule.minimumSeverity],
    );

    return criticalRule?.action ?? "escalate";
  }

  const matchedRule = policy.rules.find(
    (rule) =>
      rule.signalType === signal.type &&
      severityRank[signal.severity] >= severityRank[rule.minimumSeverity],
  );

  return matchedRule?.action ?? policy.defaultAction;
}