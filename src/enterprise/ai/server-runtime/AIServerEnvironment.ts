export interface AIServerEnvironment {
  provider: "openai";
  openAIApiKey: string;
  openAIModel: string;
}

export class AIServerEnvironmentError extends Error {
  readonly code: string;

  constructor(
    code: string,
    message: string,
  ) {
    super(message);

    this.name = "AIServerEnvironmentError";
    this.code = code;
  }
}

export const loadAIServerEnvironment =
  (): AIServerEnvironment => {
    const openAIApiKey =
      process.env.OPENAI_API_KEY?.trim();

    const openAIModel =
      process.env.OPENAI_MODEL?.trim();

    if (!openAIApiKey) {
      throw new AIServerEnvironmentError(
        "OPENAI_API_KEY_MISSING",
        "OPENAI_API_KEY is not configured.",
      );
    }

    if (!openAIModel) {
      throw new AIServerEnvironmentError(
        "OPENAI_MODEL_MISSING",
        "OPENAI_MODEL is not configured.",
      );
    }

    return {
      provider: "openai",
      openAIApiKey,
      openAIModel,
    };
  };
