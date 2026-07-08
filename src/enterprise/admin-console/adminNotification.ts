export interface AdminNotification {
  id: string;
  tenantId: string;
  actorId?: string;
  message: string;
  read: boolean;
  createdAt: Date;
}

export function markAdminNotificationRead(
  notification: AdminNotification,
): AdminNotification {
  return {
    ...notification,
    read: true,
  };
}
