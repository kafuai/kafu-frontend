import {
  createExecutiveDemoFinalIntegration,
  markExecutiveDemoFinalIntegrationReady,
} from "./executiveDemoFinalIntegration";
import {
  ExecutiveDemoFinalIntegrationContext,
} from "./executiveDemoFinalIntegrationContext";
import {
  ExecutiveDemoFinalIntegration,
  ExecutiveDemoFinalIntegrationIssue,
} from "./executiveDemoFinalIntegrationTypes";
import {
  assertExecutiveDemoFinalIntegrationValid,
} from "./executiveDemoFinalIntegrationValidator";

export interface ExecutiveDemoFinalIntegrationBuilderInput {
  context: ExecutiveDemoFinalIntegrationContext;
  title?: string;
  issues?: ExecutiveDemoFinalIntegrationIssue[];
  markReady?: boolean;
}

export function buildExecutiveDemoFinalIntegration(
  input: ExecutiveDemoFinalIntegrationBuilderInput,
): ExecutiveDemoFinalIntegration {
  const integration = createExecutiveDemoFinalIntegration({
    organizationId: input.context.organizationId,
    companyName: input.context.companyName,
    title:
      input.title?.trim() ||
      `${input.context.companyName} Executive Demo Final Integration`,
    components: input.context.components,
    checkpoints: input.context.checkpoints,
    issues: input.issues ?? [],
  });

  const finalizedIntegration = input.markReady
    ? markExecutiveDemoFinalIntegrationReady(integration)
    : integration;

  assertExecutiveDemoFinalIntegrationValid(finalizedIntegration);

  return finalizedIntegration;
}
