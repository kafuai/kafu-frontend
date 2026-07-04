import { PortfolioInitiative } from "./portfolio-management.types";

export interface StrategicAlignmentMap {
  strategicObjective: string;
  initiativeIds: string[];
  totalExpectedValue: number;
  averageConfidenceScore: number;
}

export class PortfolioStrategicAlignmentMapper {
  map(initiatives: PortfolioInitiative[]): StrategicAlignmentMap[] {
    const grouped = new Map<string, PortfolioInitiative[]>();

    for (const initiative of initiatives) {
      const objective =
        initiative.strategicObjective.trim() || "unmapped-objective";

      grouped.set(objective, [...(grouped.get(objective) ?? []), initiative]);
    }

    return [...grouped.entries()].map(([strategicObjective, items]) => ({
      strategicObjective,
      initiativeIds: items.map((item) => item.id),
      totalExpectedValue: items.reduce(
        (sum, item) => sum + item.expectedValue,
        0,
      ),
      averageConfidenceScore: Math.round(
        items.reduce((sum, item) => sum + item.confidenceScore, 0) /
          items.length,
      ),
    }));
  }
}