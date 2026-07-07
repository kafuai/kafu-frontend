import { PortfolioInitiative } from "./portfolioInitiative";
import { PortfolioOwner, PortfolioStatus } from "./portfolioManagementTypes";

export interface PortfolioProgram {
  id: string;
  name: string;
  description: string;
  owner: PortfolioOwner;
  status: PortfolioStatus;
  initiatives: PortfolioInitiative[];
}

export function calculateProgramValue(program: PortfolioProgram): number {
  return program.initiatives.reduce(
    (total, initiative) => total + initiative.expectedValue,
    0,
  );
}

export function calculateProgramCost(program: PortfolioProgram): number {
  return program.initiatives.reduce(
    (total, initiative) => total + initiative.estimatedCost,
    0,
  );
}