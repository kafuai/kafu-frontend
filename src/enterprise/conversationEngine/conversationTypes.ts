export type ConversationChannel =
  | "web"
  | "mobile"
  | "desktop"
  | "email"
  | "slack"
  | "teams"
  | "whatsapp"
  | "api";

export type ConversationRole =
  | "user"
  | "assistant"
  | "system"
  | "agent"
  | "tool";

export type ConversationStatus =
  | "active"
  | "paused"
  | "completed"
  | "archived"
  | "failed";

export type ConversationPriority =
  | "low"
  | "normal"
  | "high"
  | "critical";

export interface ConversationParticipant {
  readonly id: string;
  readonly role: ConversationRole;
  readonly displayName: string;
}

export interface ConversationContextReference {
  readonly id: string;
  readonly type: string;
  readonly score: number;
}

export interface ConversationMetadata {
  readonly tenantId: string;
  readonly organizationId: string;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly startedBy: string;
  readonly tags: readonly string[];
}

export interface ConversationUsage {
  readonly promptTokens: number;
  readonly completionTokens: number;
  readonly totalTokens: number;
}

export interface ConversationSummary {
  readonly id: string;
  readonly title: string;
  readonly status: ConversationStatus;
  readonly priority: ConversationPriority;
  readonly channel: ConversationChannel;
  readonly lastMessageAt: string;
  readonly participants: readonly ConversationParticipant[];
}

export interface ConversationConfiguration {
  readonly memoryEnabled: boolean;
  readonly reasoningEnabled: boolean;
  readonly retrievalEnabled: boolean;
  readonly toolCallingEnabled: boolean;
  readonly maxContextMessages: number;
}