import { UnifiedInsight } from "../fusion/fusion.types";

export interface AIAction {
  id: string;

  type: "notify" | "recommend" | "trigger" | "log";

  payload: {
    message?: string;
    [key: string]: unknown;
  };

  createdAt: number;
}

export interface AIDecision {
  id: string;
  organizationId: string;

  insight: UnifiedInsight;

  decision: string;
  confidence: number;

  actions: AIAction[];

  createdAt: number;
}