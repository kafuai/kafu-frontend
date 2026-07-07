import {
  PortfolioOwner,
  PortfolioPriority,
  PortfolioStatus,
  PortfolioTimeHorizon,
} from "./portfolioManagementTypes";

export interface PortfolioInitiative {
  id: string;
  title: string;
  description: string;
  owner: PortfolioOwner;
  priority: PortfolioPriority;
  status: PortfolioStatus;
  timeHorizon: PortfolioTimeHorizon;
  expectedValue: number;
  estimatedCost: number;
  dependencies: string[];
  strategicObjectives: string[];
}

export function createPortfolioInitiative(
  initiative: PortfolioInitiative,
): PortfolioInitiative {
  return {
    ...initiative,
    dependencies: [...initiative.dependencies],
    strategicObjectives: [...initiative.strategicObjectives],
  };
}

export function isInitiativeActive(initiative: PortfolioInitiative): boolean {
  return initiative.status === "active" || initiative.status === "approved";
}