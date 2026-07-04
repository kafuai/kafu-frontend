export type BackupType =
  | "full"
  | "incremental"
  | "differential"
  | "snapshot";

export type BackupLocation =
  | "local"
  | "remote"
  | "cloud"
  | "hybrid";

export type BackupStrategy = {
  id: string;
  organizationId: string;
  name: string;
  type: BackupType;
  location: BackupLocation;
  retentionDays: number;
  encrypted: boolean;
  immutable: boolean;
};

export function validateBackupStrategy(
  strategy: BackupStrategy,
): string[] {
  const issues: string[] = [];

  if (strategy.retentionDays <= 0) {
    issues.push("Retention period must be greater than zero.");
  }

  if (!strategy.encrypted) {
    issues.push("Backups should be encrypted.");
  }

  return issues;
}

export function requiresValidation(
  strategy: BackupStrategy,
): boolean {
  return strategy.immutable || strategy.location !== "local";
}