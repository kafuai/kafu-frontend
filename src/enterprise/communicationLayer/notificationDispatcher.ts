import type {
  CommunicationNotification,
} from "./notificationRepository";

export interface CommunicationNotificationDispatchResult {
  readonly notificationId: string;
  readonly successful: boolean;
  readonly provider?: string;
  readonly externalReferenceId?: string;
  readonly dispatchedAt: string;
  readonly errorMessage?: string;
}

export interface CommunicationNotificationDispatcher {
  dispatch(
    notification: CommunicationNotification,
  ): Promise<CommunicationNotificationDispatchResult>;
}

export class CompositeCommunicationNotificationDispatcher
  implements CommunicationNotificationDispatcher
{
  constructor(
    private readonly dispatchers:
      readonly CommunicationNotificationDispatcher[],
  ) {}

  async dispatch(
    notification: CommunicationNotification,
  ): Promise<CommunicationNotificationDispatchResult> {
    if (this.dispatchers.length === 0) {
      return {
        notificationId: notification.id,
        successful: false,
        dispatchedAt: new Date().toISOString(),
        errorMessage:
          "No communication notification dispatcher is configured.",
      };
    }

    const results = await Promise.all(
      this.dispatchers.map((dispatcher) =>
        dispatcher.dispatch(notification),
      ),
    );

    const successfulResult =
      results.find((result) => result.successful);

    if (successfulResult) {
      return successfulResult;
    }

    return {
      notificationId: notification.id,
      successful: false,
      dispatchedAt: new Date().toISOString(),
      errorMessage: results
        .map((result) => result.errorMessage)
        .filter(
          (message): message is string =>
            typeof message === "string" &&
            message.length > 0,
        )
        .join("; ") ||
        "Communication notification dispatch failed.",
    };
  }
}
