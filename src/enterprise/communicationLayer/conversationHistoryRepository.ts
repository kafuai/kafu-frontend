import type {
  CommunicationHistoryEntry,
  CommunicationHistoryEntryType,
} from "./conversationHistoryModels";

export interface CommunicationHistoryQuery {
  readonly companyId: string;
  readonly tenantId: string;
  readonly organizationId: string;
  readonly conversationId: string;
  readonly entryTypes?: readonly CommunicationHistoryEntryType[];
  readonly actorId?: string;
  readonly participantId?: string;
  readonly messageId?: string;
  readonly occurredAfter?: string;
  readonly occurredBefore?: string;
  readonly cursor?: string;
  readonly limit?: number;
}

export interface CommunicationHistoryPage {
  readonly entries: readonly CommunicationHistoryEntry[];
  readonly nextCursor?: string;
  readonly hasMore: boolean;
}

export interface CommunicationHistoryRepository {
  append(
    entry: CommunicationHistoryEntry,
  ): Promise<CommunicationHistoryEntry>;

  appendMany(
    entries: readonly CommunicationHistoryEntry[],
  ): Promise<readonly CommunicationHistoryEntry[]>;

  findById(
    companyId: string,
    historyEntryId: string,
  ): Promise<CommunicationHistoryEntry | null>;

  list(
    query: CommunicationHistoryQuery,
  ): Promise<CommunicationHistoryPage>;

  count(
    query: CommunicationHistoryQuery,
  ): Promise<number>;
}
