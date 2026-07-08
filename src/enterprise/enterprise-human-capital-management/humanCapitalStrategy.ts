export interface HumanCapitalStrategy {
  vision: string;
  objectives: string[];
  initiatives: string[];
}

export function isStrategyDefined(
  strategy: HumanCapitalStrategy
): boolean {
  return (
    strategy.objectives.length > 0 &&
    strategy.initiatives.length > 0
  );
}

export function countStrategicInitiatives(
  strategy: HumanCapitalStrategy
): number {
  return strategy.initiatives.length;
}
