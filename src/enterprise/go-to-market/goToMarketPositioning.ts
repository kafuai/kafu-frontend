import { GoToMarketValueProposition } from "./goToMarketValueProposition";

export interface GoToMarketPositioning {
  id: string;
  marketCategory: string;
  targetAudience: string;
  positioningStatement: string;
  valuePropositionId: string;
}

export function createPositioning(
  marketCategory: string,
  targetAudience: string,
  positioningStatement: string,
  valueProposition: GoToMarketValueProposition,
): GoToMarketPositioning {
  return {
    id: `positioning-${Date.now()}`,
    marketCategory,
    targetAudience,
    positioningStatement,
    valuePropositionId: valueProposition.id,
  };
}