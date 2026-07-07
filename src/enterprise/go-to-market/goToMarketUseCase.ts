import { GoToMarketSegment } from "./goToMarketTypes";

export interface GoToMarketUseCase {
  id: string;
  title: string;
  segment: GoToMarketSegment;
  problem: string;
  solution: string;
  expectedOutcome: string;
}

export function createUseCase(
  useCase: GoToMarketUseCase,
): GoToMarketUseCase {
  return useCase;
}