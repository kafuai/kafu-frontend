export interface AIAgentSharedContextItem {
  key: string;
  value: unknown;
  updatedAt: Date;
}

export class AIAgentSharedContext {
  private readonly items = new Map<string, AIAgentSharedContextItem>();

  set(key: string, value: unknown): void {
    this.items.set(key, {
      key,
      value,
      updatedAt: new Date(),
    });
  }

  get<T = unknown>(key: string): T | undefined {
    return this.items.get(key)?.value as T | undefined;
  }

  has(key: string): boolean {
    return this.items.has(key);
  }

  remove(key: string): boolean {
    return this.items.delete(key);
  }

  entries(): AIAgentSharedContextItem[] {
    return Array.from(this.items.values());
  }

  clear(): void {
    this.items.clear();
  }
}