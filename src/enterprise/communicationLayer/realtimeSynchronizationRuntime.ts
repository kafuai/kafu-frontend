import {
  createCommunicationRealtimeEvent,
  type CommunicationRealtimeEvent,
  type CommunicationRealtimeEventType,
  type CommunicationRealtimeScope,
} from "./realtimeSynchronizationModels";

import type {
  CommunicationRealtimeSequenceRepository,
} from "./realtimeSequenceRepository";

import type {
  CommunicationRealtimeSubscription,
  CommunicationRealtimeTransport,
} from "./realtimeSynchronizationTransport";

export interface PublishCommunicationRealtimeInput {
  readonly id: string;
  readonly type: CommunicationRealtimeEventType;
  readonly scope: CommunicationRealtimeScope;
  readonly payload:
    Readonly<Record<string, unknown>>;
  readonly correlationId?: string;
  readonly causationId?: string;
  readonly occurredAt?: string;
  readonly source?: string;
}

export interface CommunicationRealtimeSynchronizationRuntime {
  publish(
    input: PublishCommunicationRealtimeInput,
  ): Promise<CommunicationRealtimeEvent>;

  publishMany(
    inputs:
      readonly PublishCommunicationRealtimeInput[],
  ): Promise<
    readonly CommunicationRealtimeEvent[]
  >;

  subscribe(
    scope: CommunicationRealtimeScope,
    listener: (
      event: CommunicationRealtimeEvent,
    ) => void | Promise<void>,
  ): Promise<CommunicationRealtimeSubscription>;

  currentSequence(
    scope: CommunicationRealtimeScope,
  ): Promise<number>;
}

export class DefaultCommunicationRealtimeSynchronizationRuntime
  implements CommunicationRealtimeSynchronizationRuntime
{
  constructor(
    private readonly transport:
      CommunicationRealtimeTransport,
    private readonly sequenceRepository:
      CommunicationRealtimeSequenceRepository,
  ) {}

  async publish(
    input: PublishCommunicationRealtimeInput,
  ): Promise<CommunicationRealtimeEvent> {
    const sequence =
      await this.sequenceRepository.next(
        input.scope,
      );

    const event =
      createCommunicationRealtimeEvent({
        ...input,
        sequence,
      });

    await this.transport.publish(event);

    return event;
  }

  async publishMany(
    inputs:
      readonly PublishCommunicationRealtimeInput[],
  ): Promise<
    readonly CommunicationRealtimeEvent[]
  > {
    const events: CommunicationRealtimeEvent[] = [];

    for (const input of inputs) {
      const sequence =
        await this.sequenceRepository.next(
          input.scope,
        );

      events.push(
        createCommunicationRealtimeEvent({
          ...input,
          sequence,
        }),
      );
    }

    if (events.length > 0) {
      await this.transport.publishMany(events);
    }

    return events;
  }

  async subscribe(
    scope: CommunicationRealtimeScope,
    listener: (
      event: CommunicationRealtimeEvent,
    ) => void | Promise<void>,
  ): Promise<CommunicationRealtimeSubscription> {
    return this.transport.subscribe(
      scope,
      async (event) => {
        await this.sequenceRepository.ensureAtLeast(
          event.scope,
          event.sequence,
        );

        await listener(event);
      },
    );
  }

  async currentSequence(
    scope: CommunicationRealtimeScope,
  ): Promise<number> {
    return this.sequenceRepository.current(
      scope,
    );
  }
}

export function createCommunicationRealtimeSynchronizationRuntime(
  transport: CommunicationRealtimeTransport,
  sequenceRepository:
    CommunicationRealtimeSequenceRepository,
): CommunicationRealtimeSynchronizationRuntime {
  return new DefaultCommunicationRealtimeSynchronizationRuntime(
    transport,
    sequenceRepository,
  );
}
