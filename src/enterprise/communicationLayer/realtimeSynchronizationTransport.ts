import type {
  CommunicationRealtimeEvent,
  CommunicationRealtimeScope,
} from "./realtimeSynchronizationModels";

export type CommunicationRealtimeUnsubscribe =
  () => void | Promise<void>;

export interface CommunicationRealtimeSubscription {
  readonly id: string;
  readonly scope: CommunicationRealtimeScope;
  unsubscribe():
    Promise<void>;
}

export interface CommunicationRealtimeTransport {
  publish(
    event: CommunicationRealtimeEvent,
  ): Promise<void>;

  publishMany(
    events: readonly CommunicationRealtimeEvent[],
  ): Promise<void>;

  subscribe(
    scope: CommunicationRealtimeScope,
    listener: (
      event: CommunicationRealtimeEvent,
    ) => void | Promise<void>,
  ): Promise<CommunicationRealtimeSubscription>;
}

export class CompositeCommunicationRealtimeTransport
  implements CommunicationRealtimeTransport
{
  constructor(
    private readonly transports:
      readonly CommunicationRealtimeTransport[],
  ) {}

  async publish(
    event: CommunicationRealtimeEvent,
  ): Promise<void> {
    await Promise.all(
      this.transports.map((transport) =>
        transport.publish(event),
      ),
    );
  }

  async publishMany(
    events: readonly CommunicationRealtimeEvent[],
  ): Promise<void> {
    await Promise.all(
      this.transports.map((transport) =>
        transport.publishMany(events),
      ),
    );
  }

  async subscribe(
    scope: CommunicationRealtimeScope,
    listener: (
      event: CommunicationRealtimeEvent,
    ) => void | Promise<void>,
  ): Promise<CommunicationRealtimeSubscription> {
    const subscriptions =
      await Promise.all(
        this.transports.map((transport) =>
          transport.subscribe(scope, listener),
        ),
      );

    return {
      id: subscriptions
        .map((subscription) => subscription.id)
        .join(":"),
      scope,
      async unsubscribe(): Promise<void> {
        await Promise.all(
          subscriptions.map((subscription) =>
            subscription.unsubscribe(),
          ),
        );
      },
    };
  }
}
