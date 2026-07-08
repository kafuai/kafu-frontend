export interface RewardStrategy {
  objectives: string[];
  rewards: string[];
  active: boolean;
}

export function activateRewardStrategy(
  strategy: RewardStrategy
): RewardStrategy {
  return {
    ...strategy,
    active: true,
  };
}

export function hasRewardObjectives(
  strategy: RewardStrategy
): boolean {
  return strategy.objectives.length > 0;
}
