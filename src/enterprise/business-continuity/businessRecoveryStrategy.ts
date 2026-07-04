import { BusinessContinuityRecoveryTier } from "./businessContinuityTypes";

export type BusinessRecoveryStrategyType =
  | "active_active"
  | "active_passive"
  | "warm_standby"
  | "cold_standby"
  | "manual_recovery";

export type BusinessRecoveryStrategy = {
  id: string;
  name: string;
  description: string;
  type: BusinessRecoveryStrategyType;
  recoveryTier: BusinessContinuityRecoveryTier;
  priority: number;
  automated: boolean;
  enabled: boolean;
};

export function sortBusinessRecoveryStrategies(
  strategies: BusinessRecoveryStrategy[],
): BusinessRecoveryStrategy[] {
  return [...strategies].sort((a, b) => a.priority - b.priority);
}

export function findPrimaryRecoveryStrategy(
  strategies: BusinessRecoveryStrategy[],
): BusinessRecoveryStrategy | undefined {
  return sortBusinessRecoveryStrategies(strategies).find(
    (strategy) => strategy.enabled,
  );
}

export function supportsAutomatedRecovery(
  strategy: BusinessRecoveryStrategy,
): boolean {
  return strategy.enabled && strategy.automated;
}