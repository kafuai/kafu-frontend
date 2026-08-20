import {
  AIProviderGateway,
  OpenAIProvider,
} from "../provider-gateway";

import {
  GroundedAIService,
} from "../grounded-ai";

import {
  loadAIServerEnvironment,
} from "./AIServerEnvironment";

export interface AIServerRuntime {
  gateway:
    AIProviderGateway;

  groundedAI:
    GroundedAIService;
}

let runtime:
  AIServerRuntime | undefined;

export const createAIServerRuntime =
  (): AIServerRuntime => {
    const environment =
      loadAIServerEnvironment();

    const openAI =
      new OpenAIProvider({
        apiKey:
          environment.openAIApiKey,

        model:
          environment.openAIModel,
      });

    const gateway =
      new AIProviderGateway([
        openAI,
      ]);

    const groundedAI =
      new GroundedAIService({
        gateway,
        defaultProvider: "openai",
      });

    return {
      gateway,
      groundedAI,
    };
  };

export const getAIServerRuntime =
  (): AIServerRuntime => {
    runtime ??=
      createAIServerRuntime();

    return runtime;
  };
