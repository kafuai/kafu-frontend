import type { FPAAmount, FPAStatus } from "./fpaTypes";

export type FPAScenarioType = "base" | "best_case" | "worst_case" | "custom";

export interface FPAScenarioAssumption {
  id: string;
  name: string;
  impactArea: string;
  financialImpact: FPAAmount;
  probability: number;
}

export interface FPAScenario {
  id: string;
  name: string;
  type: FPAScenarioType;
  assumptions: FPAScenarioAssumption[];
  status: FPAStatus;
}

export function calculateScenarioImpact(scenario: FPAScenario): number {
  return scenario.assumptions.reduce((total, assumption) => total + assumption.financialImpact.value, 0);
}
