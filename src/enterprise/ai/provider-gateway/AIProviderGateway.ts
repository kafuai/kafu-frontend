import type {
  AIGenerationRequest,
  AIGenerationResponse,
  AIProvider,
  AIProviderId,
} from "./AIProviderTypes";

export class AIProviderGatewayError extends Error {
  readonly code: string;
  readonly provider?: AIProviderId;
  readonly cause?: unknown;

  constructor(
    code: string,
    message: string,
    provider?: AIProviderId,
    cause?: unknown,
  ) {
    super(message);

    this.name = "AIProviderGatewayError";
    this.code = code;
    this.provider = provider;
    this.cause = cause;
  }
}

export class AIProviderGateway {
  private readonly providers =
    new Map<AIProviderId, AIProvider>();

  constructor(
    providers: readonly AIProvider[] = [],
  ) {
    for (const provider of providers) {
      this.register(provider);
    }
  }

  register(provider: AIProvider): void {
    this.providers.set(
      provider.id,
      provider,
    );
  }

  has(providerId: AIProviderId): boolean {
    return this.providers.has(providerId);
  }

  async generate(
    providerId: AIProviderId,
    request: AIGenerationRequest,
  ): Promise<AIGenerationResponse> {
    const provider =
      this.providers.get(providerId);

    if (!provider) {
      throw new AIProviderGatewayError(
        "PROVIDER_NOT_REGISTERED",
        `AI provider "${providerId}" is not registered.`,
        providerId,
      );
    }

    return provider.generate(request);
  }
}
