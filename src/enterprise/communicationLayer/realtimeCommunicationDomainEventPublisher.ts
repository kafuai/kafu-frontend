import type {
  CommunicationDomainEvent,
} from "./domain/domainEvents";

import type {
  CommunicationDomainEventPublisher,
} from "./application/communicationDomainEventPublisher";

import {
  mapCommunicationDomainEventToRealtime,
} from "./domainEventRealtimeMapper";

import type {
  CommunicationRealtimeSynchronizationRuntime,
} from "./realtimeSynchronizationRuntime";

export class RealtimeCommunicationDomainEventPublisher
  implements CommunicationDomainEventPublisher
{
  constructor(
    private readonly realtime:
      CommunicationRealtimeSynchronizationRuntime,
  ) {}

  async publish(
    event: CommunicationDomainEvent,
  ): Promise<void> {
    await this.realtime.publish(
      mapCommunicationDomainEventToRealtime(event),
    );
  }

  async publishMany(
    events: readonly CommunicationDomainEvent[],
  ): Promise<void> {
    if (events.length === 0) {
      return;
    }

    await this.realtime.publishMany(
      events.map((event) =>
        mapCommunicationDomainEventToRealtime(
          event,
        ),
      ),
    );
  }
}
