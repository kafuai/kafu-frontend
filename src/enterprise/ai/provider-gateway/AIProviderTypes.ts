export type AIProviderId =
  | "openai"
  | "azure-openai"
  | "anthropic";

export interface AIGenerationMessage {
  role: "system" | "developer" | "user" | "assistant";
  content: string;
}

export interface AIGenerationRequest {
  messages: readonly AIGenerationMessage[];
  model?: string;
  correlationId?: string;
  metadata?: Readonly<Record<string, unknown>>;
}

export interface AIGenerationUsage {
  inputTokens?: number;
  outputTokens?: number;
  totalTokens?: number;
}

export interface AIGenerationResponse {
  provider: AIProviderId;
  model: string;
  text: string;
  responseId?: string;
  usage?: AIGenerationUsage;
  generatedAt: string;
}

export interface AIProvider {
  readonly id: AIProviderId;

  generate(
    request: AIGenerationRequest,
  ): Promise<AIGenerationResponse>;
}
