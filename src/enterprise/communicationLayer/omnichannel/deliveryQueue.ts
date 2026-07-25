import type {
  OmnichannelDeliveryPriority,
  OmnichannelRouteContext,
} from "./omnichannelModels";

export interface OmnichannelDeliveryQueueItem {
  readonly id: string;
  readonly context: OmnichannelRouteContext;
  readonly priority: OmnichannelDeliveryPriority;
  readonly enqueuedAt: string;
  readonly availableAt: string;
}

const priorityWeights:
  Readonly<Record<OmnichannelDeliveryPriority, number>> = {
    low: 10,
    normal: 20,
    high: 30,
    urgent: 40,
    critical: 50,
  };

export class OmnichannelDeliveryQueue {
  private readonly items:
    OmnichannelDeliveryQueueItem[] = [];

  enqueue(
    item: OmnichannelDeliveryQueueItem,
  ): void {
    this.items.push(item);

    this.items.sort((left, right) => {
      const priorityDifference =
        priorityWeights[right.priority] -
        priorityWeights[left.priority];

      if (priorityDifference !== 0) {
        return priorityDifference;
      }

      return (
        new Date(left.enqueuedAt).getTime() -
        new Date(right.enqueuedAt).getTime()
      );
    });
  }

  dequeue():
    OmnichannelDeliveryQueueItem | null {
    const now = Date.now();

    const index = this.items.findIndex(
      (item) =>
        new Date(item.availableAt).getTime() <= now,
    );

    if (index < 0) {
      return null;
    }

    return this.items.splice(index, 1)[0] ?? null;
  }

  size(): number {
    return this.items.length;
  }

  list():
    readonly OmnichannelDeliveryQueueItem[] {
    return [...this.items];
  }
}
