export interface TenantBackup {
  tenantId: string;
  lastBackupAt?: Date;
  backupPolicy: string;
}

export function registerTenantBackup(
  backup: TenantBackup,
): TenantBackup {
  return {
    ...backup,
    lastBackupAt: new Date(),
  };
}