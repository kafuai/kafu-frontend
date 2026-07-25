import {
  buildCommunicationConversationHistory,
  createCommunicationHistoryEntry,
  type CommunicationConversationHistory,
  type CommunicationHistoryEntry,
  type CreateCommunicationHistoryEntryInput,
} from "./conversationHistoryModels";

import type {
  CommunicationHistoryPage,
  CommunicationHistoryQuery,
  CommunicationHistoryRepository,
} from "./conversationHistoryRepository";

export interface CommunicationHistoryRuntime {
  record(
    input: CreateCommunicationHistoryEntryInput,
  ): Promise<CommunicationHistoryEntry>;

  recordMany(
    inputs: readonly CreateCommunicationHistoryEntryInput[],
  ): Promise<readonly CommunicationHistoryEntry[]>;

  getEntry(
    companyId: string,
    historyEntryId: string,
  ): Promise<CommunicationHistoryEntry | null>;

  list(
    query: CommunicationHistoryQuery,
  ): Promise<CommunicationHistoryPage>;

  getConversationHistory(
    query: CommunicationHistoryQuery,
  ): Promise<CommunicationConversationHistory | null>;

  count(
    query: CommunicationHistoryQuery,
  ): Promise<number>;
}

export class DefaultCommunicationHistoryRuntime
  implements CommunicationHistoryRuntime
{
  constructor(
    private readonly repository:
      CommunicationHistoryRepository,
  ) {}

  async record(
    input: CreateCommunicationHistoryEntryInput,
  ): Promise<CommunicationHistoryEntry> {
    return this.repository.append(
      createCommunicationHistoryEntry(input),
    );
  }

  async recordMany(
    inputs: readonly CreateCommunicationHistoryEntryInput[],
  ): Promise<readonly CommunicationHistoryEntry[]> {
    const entries = inputs.map((input) =>
      createCommunicationHistoryEntry(input),
    );

    if (entries.length === 0) {
      return [];
    }

    return this.repository.appendMany(entries);
  }

  async getEntry(
    companyId: string,
    historyEntryId: string,
  ): Promise<CommunicationHistoryEntry | null> {
    return this.repository.findById(
      companyId,
      historyEntryId,
    );
  }

  async list(
    query: CommunicationHistoryQuery,
  ): Promise<CommunicationHistoryPage> {
    return this.repository.list({
      ...query,
      limit: this.normalizeLimit(query.limit),
    });
  }

  async getConversationHistory(
    query: CommunicationHistoryQuery,
  ): Promise<CommunicationConversationHistory | null> {
    const collected: CommunicationHistoryEntry[] = [];
    let cursor = query.cursor;
    let hasMore = true;

    while (hasMore) {
      const page = await this.repository.list({
        ...query,
        cursor,
        limit: this.normalizeLimit(query.limit),
      });

      collected.push(...page.entries);
      cursor = page.nextCursor;
      hasMore = page.hasMore && Boolean(cursor);
    }

    return buildCommunicationConversationHistory(
      collected,
    );
  }

  async count(
    query: CommunicationHistoryQuery,
  ): Promise<number> {
    return this.repository.count(query);
  }

  private normalizeLimit(
    limit?: number,
  ): number {
    if (limit === undefined) {
      return 100;
    }

    if (!Number.isInteger(limit) || limit < 1) {
      throw new Error(
        "Communication history limit must be a positive integer.",
      );
    }

    return Math.min(limit, 500);
  }
}

export function createCommunicationHistoryRuntime(
  repository: CommunicationHistoryRepository,
): CommunicationHistoryRuntime {
  return new DefaultCommunicationHistoryRuntime(
    repository,
  );
}
