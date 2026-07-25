import type {
  CommunicationRealtimeEvent,
  CommunicationRealtimeScope,
} from "./realtimeSynchronizationModels";

import type {
  CommunicationRealtimeSubscription,
  CommunicationRealtimeTransport,
} from "./realtimeSynchronizationTransport";

interface RegisteredRealtimeSubscription {
  readonly id: string;
  readonly scope: CommunicationRealtimeScope;
  readonly listener: (
    event: CommunicationRealtimeEvent,
  ) => void | Promise<void>;
}

function scopesMatch(
  subscription: CommunicationRealtimeScope,
  event: CommunicationRealtimeScope,
): boolean {
  return (
    subscription.companyId === event.companyId &&
    subscription.tenantId === event.tenantId &&
    subscription.organizationId ===
      event.organizationId &&
    (
      !subscription.conversationId ||
      subscription.conversationId ===
        event.conversationId
    ) &&
    (
      !subscription.participantId ||
      subscription.participantId ===
        event.participantId
    )
  );
}

export class InMemoryCommunicationRealtimeTransport
  implements CommunicationRealtimeTransport
{
  private readonly subscriptions =
    new Map<
      string,
      RegisteredRealtimeSubscription
    >();

  async publish(
    event: CommunicationRealtimeEvent,
  ): Promise<void> {
    const listeners =
      [...this.subscriptions.values()]
        .filter((subscription) =>
          scopesMatch(
            subscription.scope,
            event.scope,
          ),
        );

    await Promise.all(
      listeners.map((subscription) =>
        subscription.listener(event),
      ),
    );
  }

  async publishMany(
    events:
      readonly CommunicationRealtimeEvent[],
  ): Promise<void> {
    for (const event of events) {
      await this.publish(event);
    }
  }

  async subscribe(
    scope: CommunicationRealtimeScope,
    listener: (
      event: CommunicationRealtimeEvent,
    ) => void | Promise<void>,
  ): Promise<CommunicationRealtimeSubscription> {
    const id =
      globalThis.crypto?.randomUUID?.() ??
      `${Date.now()}-${Math.random()}`;

    this.subscriptions.set(id, {
      id,
      scope,
      listener,
    });

    return {
      id,
      scope,
      unsubscribe: async () => {
        this.subscriptions.delete(id);
      },
    };
  }
}
