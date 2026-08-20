import {
  AIProviderGateway,
} from "../provider-gateway";

import {
  GroundedAIPromptBuilder,
} from "./GroundedAIPromptBuilder";

import type {
  GroundedAICitation,
  GroundedAIRequest,
  GroundedAIResult,
} from "./GroundedAITypes";

export interface GroundedAIServiceDependencies {
  gateway:
    AIProviderGateway;

  promptBuilder?:
    GroundedAIPromptBuilder;

  defaultProvider?:
    GroundedAIRequest["provider"];
}

export class GroundedAIService {
  private readonly gateway:
    AIProviderGateway;

  private readonly promptBuilder:
    GroundedAIPromptBuilder;

  private readonly defaultProvider:
    NonNullable<
      GroundedAIRequest["provider"]
    >;

  constructor(
    dependencies:
      GroundedAIServiceDependencies,
  ) {
    this.gateway =
      dependencies.gateway;

    this.promptBuilder =
      dependencies.promptBuilder
      ?? new GroundedAIPromptBuilder();

    this.defaultProvider =
      dependencies.defaultProvider
      ?? "openai";
  }

  async generate(
    request: GroundedAIRequest,
  ): Promise<GroundedAIResult> {
    const provider =
      request.provider
      ?? this.defaultProvider;

    const messages =
      this.promptBuilder.build(
        request,
      );

    const response =
      await this.gateway.generate(
        provider,
        {
          messages,
          model:
            request.model,
          correlationId:
            request.correlationId,
          metadata: {
            tenantId:
              request.context.tenantId,
            workspaceId:
              request.context.workspaceId,
            companyId:
              request.context.companyId,
            evidenceCount:
              request.evidence.length,
          },
        },
      );

    return {
      provider:
        response.provider,
      model:
        response.model,
      text:
        response.text,
      citations:
        this.buildCitations(
          response.text,
          request,
        ),
      evidenceCount:
        request.evidence.length,
      responseId:
        response.responseId,
      correlationId:
        request.correlationId,
      generatedAt:
        response.generatedAt,
      usage:
        response.usage,
    };
  }

  private buildCitations(
    text: string,
    request: GroundedAIRequest,
  ): readonly GroundedAICitation[] {
    return request.evidence
      .filter(
        (evidence) =>
          text.includes(
            `[${evidence.id}]`,
          ),
      )
      .map(
        (evidence) => ({
          evidenceId:
            evidence.id,
          source:
            evidence.source,
          label:
            evidence.label,
        }),
      );
  }
}

export const createGroundedAIService = (
  dependencies:
    GroundedAIServiceDependencies,
): GroundedAIService =>
  new GroundedAIService(
    dependencies,
  );
