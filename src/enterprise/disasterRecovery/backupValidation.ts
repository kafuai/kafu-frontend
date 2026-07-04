import { BackupStrategy } from "./backupStrategies";

export type BackupValidationResult = {
  strategyId: string;
  successful: boolean;
  validatedAt: string;
  findings: string[];
};

export function validateBackup(
  strategy: BackupStrategy,
): BackupValidationResult {
  const findings: string[] = [];

  if (!strategy.encrypted) {
    findings.push("Encryption is disabled.");
  }

  if (strategy.retentionDays < 7) {
    findings.push("Retention period is below recommended minimum.");
  }

  return {
    strategyId: strategy.id,
    successful: findings.length === 0,
    validatedAt: new Date().toISOString(),
    findings,
  };
}