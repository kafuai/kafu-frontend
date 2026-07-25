import type {
  CommunicationDomainEvent,
} from "./domain/domainEvents";

import type {
  CommunicationDomainEventPublisher,
} from "./application/communicationDomainEventPublisher";

import {
  mapCommunicationDomainEventToHistory,
} from "./domainEventHistoryMapper";

import type {
  CommunicationHistoryRuntime,
} from "./conversationHistoryRuntime";

export class HistoryCommunicationDomainEventPublisher
  implements CommunicationDomainEventPublisher
{
  constructor(
    private readonly history:
      CommunicationHistoryRuntime,
  ) {}

  async publish(
    event: CommunicationDomainEvent,
  ): Promise<void> {
    await this.history.record(
      mapCommunicationDomainEventToHistory(event),
    );
  }

  async publishMany(
    events: readonly CommunicationDomainEvent[],
  ): Promise<void> {
    if (events.length === 0) {
      return;
    }

    await this.history.recordMany(
      events.map((event) =>
        mapCommunicationDomainEventToHistory(event),
      ),
    );
  }
}
