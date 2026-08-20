import OpenAI from "openai";

import type {
  AIGenerationMessage,
  AIGenerationRequest,
  AIGenerationResponse,
  AIProvider,
} from "./AIProviderTypes";
import {
  AIProviderGatewayError,
} from "./AIProviderGateway";

export interface OpenAIProviderOptions {
  apiKey?: string;
  model?: string;
}

const DEFAULT_MODEL = "gpt-5";

export class OpenAIProvider
  implements AIProvider {
  readonly id = "openai" as const;

  private readonly client: OpenAI;
  private readonly model: string;

  constructor(
    options: OpenAIProviderOptions = {},
  ) {
    const apiKey =
      options.apiKey
      ?? process.env.OPENAI_API_KEY;

    if (!apiKey) {
      throw new AIProviderGatewayError(
        "OPENAI_API_KEY_MISSING",
        "OPENAI_API_KEY is not configured.",
        this.id,
      );
    }

    this.client =
      new OpenAI({ apiKey });

    this.model =
      options.model
      ?? process.env.OPENAI_MODEL
      ?? DEFAULT_MODEL;
  }

  async generate(
    request: AIGenerationRequest,
  ): Promise<AIGenerationResponse> {
    try {
      const response =
        await this.client.responses.create({
          model:
            request.model
            ?? this.model,

          input:
            this.toOpenAIInput(
              request.messages,
            ),
        });

      return {
        provider: this.id,
        model:
          request.model
          ?? this.model,
        text:
          response.output_text,
        responseId:
          response.id,
        usage: {
          inputTokens:
            response.usage?.input_tokens,
          outputTokens:
            response.usage?.output_tokens,
          totalTokens:
            response.usage?.total_tokens,
        },
        generatedAt:
          new Date().toISOString(),
      };
    } catch (error) {
      throw new AIProviderGatewayError(
        "OPENAI_GENERATION_FAILED",
        error instanceof Error
          ? error.message
          : "OpenAI generation failed.",
        this.id,
        error,
      );
    }
  }

  private toOpenAIInput(
    messages:
      readonly AIGenerationMessage[],
  ) {
    return messages.map(
      (message) => ({
        role: message.role,
        content: message.content,
      }),
    );
  }
}
