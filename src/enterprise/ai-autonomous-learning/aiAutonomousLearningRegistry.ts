import { AIAutonomousLearningFeedback } from "./aiAutonomousLearningFeedback";
import { AIAutonomousLearningInsight } from "./aiAutonomousLearningInsight";
import { AIAutonomousLearningObjective } from "./aiAutonomousLearningObjective";
import { AIAutonomousLearningPlan } from "./aiAutonomousLearningPlan";
import { AIAutonomousLearningPolicy } from "./aiAutonomousLearningPolicy";
import { AIAutonomousLearningSignal } from "./aiAutonomousLearningSignal";

export interface AIAutonomousLearningRegistryState {
  signals: AIAutonomousLearningSignal[];
  feedback: AIAutonomousLearningFeedback[];
  objectives: AIAutonomousLearningObjective[];
  insights: AIAutonomousLearningInsight[];
  policies: AIAutonomousLearningPolicy[];
  plans: AIAutonomousLearningPlan[];
}

export function createAIAutonomousLearningRegistryState(): AIAutonomousLearningRegistryState {
  return {
    signals: [],
    feedback: [],
    objectives: [],
    insights: [],
    policies: [],
    plans: [],
  };
}

export function registerAIAutonomousLearningSignal(
  state: AIAutonomousLearningRegistryState,
  signal: AIAutonomousLearningSignal,
): AIAutonomousLearningRegistryState {
  return {
    ...state,
    signals: [...state.signals, signal],
  };
}

export function registerAIAutonomousLearningFeedback(
  state: AIAutonomousLearningRegistryState,
  feedback: AIAutonomousLearningFeedback,
): AIAutonomousLearningRegistryState {
  return {
    ...state,
    feedback: [...state.feedback, feedback],
  };
}

export function registerAIAutonomousLearningObjective(
  state: AIAutonomousLearningRegistryState,
  objective: AIAutonomousLearningObjective,
): AIAutonomousLearningRegistryState {
  return {
    ...state,
    objectives: [...state.objectives, objective],
  };
}

export function registerAIAutonomousLearningInsight(
  state: AIAutonomousLearningRegistryState,
  insight: AIAutonomousLearningInsight,
): AIAutonomousLearningRegistryState {
  return {
    ...state,
    insights: [...state.insights, insight],
  };
}

export function registerAIAutonomousLearningPolicy(
  state: AIAutonomousLearningRegistryState,
  policy: AIAutonomousLearningPolicy,
): AIAutonomousLearningRegistryState {
  return {
    ...state,
    policies: [...state.policies, policy],
  };
}

export function registerAIAutonomousLearningPlan(
  state: AIAutonomousLearningRegistryState,
  plan: AIAutonomousLearningPlan,
): AIAutonomousLearningRegistryState {
  return {
    ...state,
    plans: [...state.plans, plan],
  };
}