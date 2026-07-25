import type {
  CommunicationChannel,
} from "../communicationTypes";

import type {
  OmnichannelDeliveryAttempt,
  OmnichannelDeliveryPriority,
} from "./omnichannelModels";

export type OmnichannelDeliveryOutcome =
  | "succeeded"
  | "failed";

export interface OmnichannelDeliveryAnalyticsRecord {
  readonly id: string;
  readonly companyId: string;
  readonly tenantId: string;
  readonly organizationId: string;
  readonly conversationId: string;
  readonly messageId: string;
  readonly channel: CommunicationChannel;
  readonly providerId?: string;
  readonly priority: OmnichannelDeliveryPriority;
  readonly outcome: OmnichannelDeliveryOutcome;
  readonly attempts: readonly OmnichannelDeliveryAttempt[];
  readonly durationMs: number;
  readonly recordedAt: string;
  readonly error?: string;
}

export interface OmnichannelDeliveryAnalyticsQuery {
  readonly companyId?: string;
  readonly tenantId?: string;
  readonly organizationId?: string;
  readonly conversationId?: string;
  readonly messageId?: string;
  readonly channel?: CommunicationChannel;
  readonly providerId?: string;
  readonly outcome?: OmnichannelDeliveryOutcome;
}

export interface OmnichannelDeliveryAnalyticsSummary {
  readonly totalDeliveries: number;
  readonly successfulDeliveries: number;
  readonly failedDeliveries: number;
  readonly successRate: number;
  readonly averageDurationMs: number;
  readonly totalAttempts: number;
}

export interface OmnichannelDeliveryAnalyticsRepository {
  record(
    entry: OmnichannelDeliveryAnalyticsRecord,
  ): Promise<void>;

  list(
    query?: OmnichannelDeliveryAnalyticsQuery,
  ): Promise<
    readonly OmnichannelDeliveryAnalyticsRecord[]
  >;

  summarize(
    query?: OmnichannelDeliveryAnalyticsQuery,
  ): Promise<OmnichannelDeliveryAnalyticsSummary>;
}

export class InMemoryOmnichannelDeliveryAnalyticsRepository
  implements OmnichannelDeliveryAnalyticsRepository
{
  private readonly entries =
    new Map<
      string,
      OmnichannelDeliveryAnalyticsRecord
    >();

  async record(
    entry: OmnichannelDeliveryAnalyticsRecord,
  ): Promise<void> {
    this.entries.set(entry.id, entry);
  }

  async list(
    query: OmnichannelDeliveryAnalyticsQuery = {},
  ): Promise<
    readonly OmnichannelDeliveryAnalyticsRecord[]
  > {
    return [...this.entries.values()]
      .filter((entry) =>
        this.matches(entry, query),
      )
      .sort(
        (left, right) =>
          new Date(right.recordedAt).getTime() -
          new Date(left.recordedAt).getTime(),
      );
  }

  async summarize(
    query: OmnichannelDeliveryAnalyticsQuery = {},
  ): Promise<OmnichannelDeliveryAnalyticsSummary> {
    const entries = await this.list(query);

    const successfulDeliveries =
      entries.filter(
        (entry) =>
          entry.outcome === "succeeded",
      ).length;

    const failedDeliveries =
      entries.length - successfulDeliveries;

    const totalDurationMs =
      entries.reduce(
        (total, entry) =>
          total + entry.durationMs,
        0,
      );

    const totalAttempts =
      entries.reduce(
        (total, entry) =>
          total + entry.attempts.length,
        0,
      );

    return {
      totalDeliveries: entries.length,
      successfulDeliveries,
      failedDeliveries,
      successRate:
        entries.length === 0
          ? 0
          : successfulDeliveries /
            entries.length,
      averageDurationMs:
        entries.length === 0
          ? 0
          : Math.round(
              totalDurationMs /
                entries.length,
            ),
      totalAttempts,
    };
  }

  private matches(
    entry:
      OmnichannelDeliveryAnalyticsRecord,
    query:
      OmnichannelDeliveryAnalyticsQuery,
  ): boolean {
    if (
      query.companyId &&
      entry.companyId !== query.companyId
    ) {
      return false;
    }

    if (
      query.tenantId &&
      entry.tenantId !== query.tenantId
    ) {
      return false;
    }

    if (
      query.organizationId &&
      entry.organizationId !==
        query.organizationId
    ) {
      return false;
    }

    if (
      query.conversationId &&
      entry.conversationId !==
        query.conversationId
    ) {
      return false;
    }

    if (
      query.messageId &&
      entry.messageId !== query.messageId
    ) {
      return false;
    }

    if (
      query.channel &&
      entry.channel !== query.channel
    ) {
      return false;
    }

    if (
      query.providerId &&
      entry.providerId !== query.providerId
    ) {
      return false;
    }

    if (
      query.outcome &&
      entry.outcome !== query.outcome
    ) {
      return false;
    }

    return true;
  }
}
