import { PortfolioInitiative } from "./portfolioInitiative";

export type PortfolioDecision =
  | "approve"
  | "defer"
  | "reject"
  | "review";

export function recommendPortfolioDecision(
  initiative: PortfolioInitiative,
  score: number,
): PortfolioDecision {
  if (score >= 85) {
    return "approve";
  }

  if (score >= 70) {
    return "review";
  }

  if (score >= 50) {
    return "defer";
  }

  return "reject";
}