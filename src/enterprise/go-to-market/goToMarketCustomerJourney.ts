export type CustomerJourneyStage =
  | "awareness"
  | "consideration"
  | "evaluation"
  | "purchase"
  | "adoption"
  | "expansion";

export interface CustomerJourneyStep {
  stage: CustomerJourneyStage;
  objective: string;
  touchpoints: string[];
}

export function createCustomerJourney(
  steps: CustomerJourneyStep[],
): CustomerJourneyStep[] {
  return steps;
}