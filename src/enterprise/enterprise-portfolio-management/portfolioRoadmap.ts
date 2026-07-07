import { PortfolioInitiative } from "./portfolioInitiative";

export interface PortfolioRoadmapPhase {
  name: string;
  initiatives: PortfolioInitiative[];
}

export interface PortfolioRoadmap {
  phases: PortfolioRoadmapPhase[];
}

export function countRoadmapInitiatives(
  roadmap: PortfolioRoadmap,
): number {
  return roadmap.phases.reduce(
    (total, phase) => total + phase.initiatives.length,
    0,
  );
}