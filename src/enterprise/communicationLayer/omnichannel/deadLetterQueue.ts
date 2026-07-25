import type {
  OmnichannelDeliveryAttempt,
  OmnichannelRouteContext,
  OmnichannelRoutePlan,
} from "./omnichannelModels";

export interface OmnichannelDeadLetter {
  readonly id: string;
  readonly context: OmnichannelRouteContext;
  readonly routePlan: OmnichannelRoutePlan;
  readonly attempts:
    readonly OmnichannelDeliveryAttempt[];
  readonly reason: string;
  readonly failedAt: string;
}

export interface OmnichannelDeadLetterRepository {
  add(
    entry: OmnichannelDeadLetter,
  ): Promise<void>;

  get(
    id: string,
  ): Promise<OmnichannelDeadLetter | null>;

  list():
    Promise<readonly OmnichannelDeadLetter[]>;

  remove(
    id: string,
  ): Promise<void>;
}

export class InMemoryOmnichannelDeadLetterRepository
  implements OmnichannelDeadLetterRepository
{
  private readonly entries =
    new Map<string, OmnichannelDeadLetter>();

  async add(
    entry: OmnichannelDeadLetter,
  ): Promise<void> {
    this.entries.set(entry.id, entry);
  }

  async get(
    id: string,
  ): Promise<OmnichannelDeadLetter | null> {
    return this.entries.get(id) ?? null;
  }

  async list():
    Promise<readonly OmnichannelDeadLetter[]> {
    return [...this.entries.values()];
  }

  async remove(
    id: string,
  ): Promise<void> {
    this.entries.delete(id);
  }
}
