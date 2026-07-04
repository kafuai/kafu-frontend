import { AIAgentProfile } from "./aiAgentTypes";

export type AIAgentMemoryScope = "agent" | "goal" | "task" | "organization";

export interface AIAgentMemoryEntry {
  id: string;
  organizationId: string;
  agentId: string;
  scope: AIAgentMemoryScope;
  referenceId?: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: Date;
}

export class AIAgentMemoryStore {
  private readonly entries = new Map<string, AIAgentMemoryEntry>();

  add(entry: AIAgentMemoryEntry): AIAgentMemoryEntry {
    this.entries.set(entry.id, entry);
    return entry;
  }

  listByAgent(profile: AIAgentProfile): AIAgentMemoryEntry[] {
    return Array.from(this.entries.values()).filter(
      (entry) =>
        entry.organizationId === profile.organizationId &&
        entry.agentId === profile.id,
    );
  }

  search(agentId: string, keyword: string): AIAgentMemoryEntry[] {
    const normalized = keyword.toLowerCase();

    return Array.from(this.entries.values()).filter(
      (entry) =>
        entry.agentId === agentId &&
        `${entry.title} ${entry.content} ${entry.tags.join(" ")}`
          .toLowerCase()
          .includes(normalized),
    );
  }
}