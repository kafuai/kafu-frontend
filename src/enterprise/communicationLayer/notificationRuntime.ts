import type {
  CommunicationNotificationDispatcher,
  CommunicationNotificationDispatchResult,
} from "./notificationDispatcher";

import type {
  CommunicationNotification,
  CommunicationNotificationPriority,
  CommunicationNotificationQuery,
  CommunicationNotificationRepository,
} from "./notificationRepository";

export interface CreateCommunicationNotificationInput {
  readonly id: string;
  readonly companyId: string;
  readonly tenantId: string;
  readonly organizationId: string;
  readonly recipientId: string;
  readonly conversationId?: string;
  readonly messageId?: string;
  readonly title: string;
  readonly body: string;
  readonly priority?: CommunicationNotificationPriority;
  readonly actionUrl?: string;
  readonly metadata?: Readonly<Record<string, unknown>>;
}

function createNotification(
  input: CreateCommunicationNotificationInput,
): CommunicationNotification {
  if (!input.id.trim()) {
    throw new Error(
      "Communication notification id is required.",
    );
  }

  if (!input.companyId.trim()) {
    throw new Error(
      "Communication notification company id is required.",
    );
  }

  if (!input.recipientId.trim()) {
    throw new Error(
      "Communication notification recipient id is required.",
    );
  }

  if (!input.title.trim()) {
    throw new Error(
      "Communication notification title is required.",
    );
  }

  if (!input.body.trim()) {
    throw new Error(
      "Communication notification body is required.",
    );
  }

  return {
    ...input,
    priority: input.priority ?? "normal",
    status: "pending",
    createdAt: new Date().toISOString(),
  };
}

export interface CommunicationNotificationRuntime {
  create(
    input: CreateCommunicationNotificationInput,
  ): Promise<CommunicationNotification>;

  dispatch(
    companyId: string,
    notificationId: string,
  ): Promise<CommunicationNotificationDispatchResult>;

  markRead(
    companyId: string,
    notificationId: string,
  ): Promise<CommunicationNotification>;

  dismiss(
    companyId: string,
    notificationId: string,
  ): Promise<CommunicationNotification>;

  list(
    query: CommunicationNotificationQuery,
  ): Promise<readonly CommunicationNotification[]>;
}

export class DefaultCommunicationNotificationRuntime
  implements CommunicationNotificationRuntime
{
  constructor(
    private readonly repository:
      CommunicationNotificationRepository,
    private readonly dispatcher:
      CommunicationNotificationDispatcher,
  ) {}

  async create(
    input: CreateCommunicationNotificationInput,
  ): Promise<CommunicationNotification> {
    return this.repository.create(
      createNotification(input),
    );
  }

  async dispatch(
    companyId: string,
    notificationId: string,
  ): Promise<CommunicationNotificationDispatchResult> {
    const notification =
      await this.requireNotification(
        companyId,
        notificationId,
      );

    const result =
      await this.dispatcher.dispatch(notification);

    await this.repository.update({
      ...notification,
      status: result.successful
        ? "dispatched"
        : "failed",
      dispatchedAt: result.successful
        ? result.dispatchedAt
        : notification.dispatchedAt,
      failureReason: result.successful
        ? undefined
        : result.errorMessage,
    });

    return result;
  }

  async markRead(
    companyId: string,
    notificationId: string,
  ): Promise<CommunicationNotification> {
    const notification =
      await this.requireNotification(
        companyId,
        notificationId,
      );

    return this.repository.update({
      ...notification,
      status: "read",
      readAt: new Date().toISOString(),
    });
  }

  async dismiss(
    companyId: string,
    notificationId: string,
  ): Promise<CommunicationNotification> {
    const notification =
      await this.requireNotification(
        companyId,
        notificationId,
      );

    return this.repository.update({
      ...notification,
      status: "dismissed",
      dismissedAt: new Date().toISOString(),
    });
  }

  async list(
    query: CommunicationNotificationQuery,
  ): Promise<readonly CommunicationNotification[]> {
    return this.repository.list(query);
  }

  private async requireNotification(
    companyId: string,
    notificationId: string,
  ): Promise<CommunicationNotification> {
    const notification =
      await this.repository.findById(
        companyId,
        notificationId,
      );

    if (!notification) {
      throw new Error(
        `Communication notification "${notificationId}" was not found.`,
      );
    }

    return notification;
  }
}

export function createCommunicationNotificationRuntime(
  repository: CommunicationNotificationRepository,
  dispatcher: CommunicationNotificationDispatcher,
): CommunicationNotificationRuntime {
  return new DefaultCommunicationNotificationRuntime(
    repository,
    dispatcher,
  );
}
