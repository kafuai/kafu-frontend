export interface AIAgentSharedMemoryRecord {
  id: string;
  category: string;
  content: string;
  createdAt: Date;
  expiresAt?: Date;
}

export class AIAgentSharedMemory {
  private readonly records = new Map<string, AIAgentSharedMemoryRecord>();

  add(record: AIAgentSharedMemoryRecord): void {
    if (!record.id.trim()) {
      throw new Error("Memory id is required");
    }

    this.records.set(record.id, record);
  }

  get(id: string): AIAgentSharedMemoryRecord | undefined {
    return this.records.get(id);
  }

  list(): AIAgentSharedMemoryRecord[] {
    return Array.from(this.records.values());
  }

  listByCategory(category: string): AIAgentSharedMemoryRecord[] {
    return this.list().filter(
      (record) => record.category === category,
    );
  }

  remove(id: string): boolean {
    return this.records.delete(id);
  }

  clearExpired(referenceDate: Date = new Date()): number {
    let removed = 0;

    for (const [id, record] of this.records) {
      if (
        record.expiresAt &&
        record.expiresAt.getTime() <= referenceDate.getTime()
      ) {
        this.records.delete(id);
        removed++;
      }
    }

    return removed;
  }

  clear(): void {
    this.records.clear();
  }
}