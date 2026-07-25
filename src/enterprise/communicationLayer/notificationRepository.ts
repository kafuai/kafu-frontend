export type CommunicationNotificationStatus =
  | "pending"
  | "dispatched"
  | "read"
  | "dismissed"
  | "failed";

export type CommunicationNotificationPriority =
  | "low"
  | "normal"
  | "high"
  | "critical";

export interface CommunicationNotification {
  readonly id: string;
  readonly companyId: string;
  readonly tenantId: string;
  readonly organizationId: string;
  readonly recipientId: string;
  readonly conversationId?: string;
  readonly messageId?: string;
  readonly title: string;
  readonly body: string;
  readonly priority: CommunicationNotificationPriority;
  readonly status: CommunicationNotificationStatus;
  readonly actionUrl?: string;
  readonly metadata?: Readonly<Record<string, unknown>>;
  readonly createdAt: string;
  readonly dispatchedAt?: string;
  readonly readAt?: string;
  readonly dismissedAt?: string;
  readonly failureReason?: string;
}

export interface CommunicationNotificationQuery {
  readonly companyId: string;
  readonly recipientId: string;
  readonly status?: CommunicationNotificationStatus;
  readonly conversationId?: string;
  readonly limit?: number;
}

export interface CommunicationNotificationRepository {
  create(
    notification: CommunicationNotification,
  ): Promise<CommunicationNotification>;

  update(
    notification: CommunicationNotification,
  ): Promise<CommunicationNotification>;

  findById(
    companyId: string,
    notificationId: string,
  ): Promise<CommunicationNotification | null>;

  list(
    query: CommunicationNotificationQuery,
  ): Promise<readonly CommunicationNotification[]>;
}
