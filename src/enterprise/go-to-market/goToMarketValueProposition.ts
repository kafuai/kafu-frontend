import { GoToMarketSegment } from "./goToMarketTypes";

export interface GoToMarketValueProposition {
  id: string;
  segment: GoToMarketSegment;
  headline: string;
  valueDrivers: string[];
  customerOutcomes: string[];
}

export function createValueProposition(
  proposition: GoToMarketValueProposition,
): GoToMarketValueProposition {
  return proposition;
}