export interface AdminMaintenance {
  enabled: boolean;
  message?: string;
  scheduledAt?: Date;
}

export function isMaintenanceActive(
  maintenance: AdminMaintenance,
): boolean {
  return maintenance.enabled;
}
