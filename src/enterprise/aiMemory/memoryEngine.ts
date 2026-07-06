import { EnterpriseMemoryRegistry } from "./memoryRegistry";
import { filterEnterpriseMemory, type EnterpriseMemoryQuery } from "./memoryQuery";
import { searchEnterpriseMemory } from "./memorySearch";
import { filterAccessibleEnterpriseMemory, type EnterpriseMemoryAccessContext } from "./memorySecurity";
import { filterReusableEnterpriseMemory } from "./memoryRetention";
import { rankEnterpriseMemory } from "./memoryRanking";
import type { EnterpriseMemoryRecord } from "./memoryTypes";

export class EnterpriseMemoryEngine {
  constructor(
    private readonly registry = new EnterpriseMemoryRegistry(),
  ) {}

  register(record: EnterpriseMemoryRecord): void {
    this.registry.register(record);
  }

  registerMany(records: readonly EnterpriseMemoryRecord[]): void {
    this.registry.registerMany(records);
  }

  query(query: EnterpriseMemoryQuery): EnterpriseMemoryRecord[] {
    return filterEnterpriseMemory(this.registry.list(), query);
  }

  search(keyword: string): EnterpriseMemoryRecord[] {
    return searchEnterpriseMemory(this.registry.list(), keyword);
  }

  accessible(
    context: EnterpriseMemoryAccessContext,
  ): EnterpriseMemoryRecord[] {
    return filterAccessibleEnterpriseMemory(
      this.registry.list(),
      context,
    );
  }

  reusable(): EnterpriseMemoryRecord[] {
    return filterReusableEnterpriseMemory(
      this.registry.list(),
    );
  }

  ranked(): EnterpriseMemoryRecord[] {
    return rankEnterpriseMemory(
      this.registry.list(),
    );
  }

  all(): readonly EnterpriseMemoryRecord[] {
    return this.registry.list();
  }
}