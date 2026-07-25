export interface CommunicationRealtimeSequenceKey {
  readonly companyId: string;
  readonly tenantId: string;
  readonly organizationId: string;
  readonly conversationId?: string;
}

export interface CommunicationRealtimeSequenceRepository {
  next(
    key: CommunicationRealtimeSequenceKey,
  ): Promise<number>;

  current(
    key: CommunicationRealtimeSequenceKey,
  ): Promise<number>;

  ensureAtLeast(
    key: CommunicationRealtimeSequenceKey,
    sequence: number,
  ): Promise<number>;
}

export class InMemoryCommunicationRealtimeSequenceRepository
  implements CommunicationRealtimeSequenceRepository
{
  private readonly sequences =
    new Map<string, number>();

  async next(
    key: CommunicationRealtimeSequenceKey,
  ): Promise<number> {
    const mapKey = this.createKey(key);
    const nextSequence =
      (this.sequences.get(mapKey) ?? 0) + 1;

    this.sequences.set(mapKey, nextSequence);

    return nextSequence;
  }

  async current(
    key: CommunicationRealtimeSequenceKey,
  ): Promise<number> {
    return this.sequences.get(
      this.createKey(key),
    ) ?? 0;
  }

  async ensureAtLeast(
    key: CommunicationRealtimeSequenceKey,
    sequence: number,
  ): Promise<number> {
    if (!Number.isInteger(sequence) || sequence < 0) {
      throw new Error(
        "Communication realtime sequence must be a non-negative integer.",
      );
    }

    const mapKey = this.createKey(key);
    const current =
      this.sequences.get(mapKey) ?? 0;
    const resolved =
      Math.max(current, sequence);

    this.sequences.set(mapKey, resolved);

    return resolved;
  }

  private createKey(
    key: CommunicationRealtimeSequenceKey,
  ): string {
    return [
      key.companyId,
      key.tenantId,
      key.organizationId,
      key.conversationId ?? "*",
    ].join(":");
  }
}
