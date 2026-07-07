export interface GoToMarketDifferentiator {
  id: string;
  title: string;
  description: string;
  impactScore: number;
}

export function rankDifferentiators(
  differentiators: GoToMarketDifferentiator[],
): GoToMarketDifferentiator[] {
  return [...differentiators].sort(
    (a, b) => b.impactScore - a.impactScore,
  );
}