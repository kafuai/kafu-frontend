import type {
  CommunicationDomainEvent,
} from "../domain/domainEvents";

export interface CommunicationDomainEventPublisher {
  publish(
    event: CommunicationDomainEvent,
  ): Promise<void>;

  publishMany(
    events: readonly CommunicationDomainEvent[],
  ): Promise<void>;
}

export class NoopCommunicationDomainEventPublisher
  implements CommunicationDomainEventPublisher
{
  async publish(
    _event: CommunicationDomainEvent,
  ): Promise<void> {}

  async publishMany(
    _events: readonly CommunicationDomainEvent[],
  ): Promise<void> {}
}

export class CompositeCommunicationDomainEventPublisher
  implements CommunicationDomainEventPublisher
{
  constructor(
    private readonly publishers:
      readonly CommunicationDomainEventPublisher[],
  ) {}

  async publish(
    event: CommunicationDomainEvent,
  ): Promise<void> {
    await Promise.all(
      this.publishers.map((publisher) =>
        publisher.publish(event),
      ),
    );
  }

  async publishMany(
    events: readonly CommunicationDomainEvent[],
  ): Promise<void> {
    await Promise.all(
      this.publishers.map((publisher) =>
        publisher.publishMany(events),
      ),
    );
  }
}

export class InMemoryCommunicationDomainEventPublisher
  implements CommunicationDomainEventPublisher
{
  private readonly events: CommunicationDomainEvent[] = [];

  async publish(
    event: CommunicationDomainEvent,
  ): Promise<void> {
    this.events.push(event);
  }

  async publishMany(
    events: readonly CommunicationDomainEvent[],
  ): Promise<void> {
    this.events.push(...events);
  }

  getPublishedEvents(): readonly CommunicationDomainEvent[] {
    return [...this.events];
  }

  clear(): void {
    this.events.length = 0;
  }
}
