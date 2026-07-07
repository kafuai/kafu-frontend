import { PortfolioHealth } from "./portfolioHealth";
import { PortfolioProgram, calculateProgramCost, calculateProgramValue } from "./portfolioProgram";

export interface PortfolioDashboard {
  totalPrograms: number;
  totalValue: number;
  totalCost: number;
  portfolioHealth: PortfolioHealth;
}

export function buildPortfolioDashboard(
  programs: PortfolioProgram[],
  portfolioHealth: PortfolioHealth,
): PortfolioDashboard {
  return {
    totalPrograms: programs.length,
    totalValue: programs.reduce(
      (total, program) => total + calculateProgramValue(program),
      0,
    ),
    totalCost: programs.reduce(
      (total, program) => total + calculateProgramCost(program),
      0,
    ),
    portfolioHealth,
  };
}