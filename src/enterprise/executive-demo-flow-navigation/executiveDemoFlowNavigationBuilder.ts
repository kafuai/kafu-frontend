import {
  createExecutiveDemoFlowNavigation,
} from "./executiveDemoFlowNavigation";
import {
  ExecutiveDemoFlowNavigationContext,
} from "./executiveDemoFlowNavigationContext";
import {
  ExecutiveDemoFlowNavigation,
  ExecutiveDemoFlowNavigationStep,
} from "./executiveDemoFlowNavigationTypes";
import {
  assertExecutiveDemoFlowNavigationValid,
} from "./executiveDemoFlowNavigationValidator";

export interface ExecutiveDemoFlowNavigationBuilderInput {
  context: ExecutiveDemoFlowNavigationContext;
  title?: string;
  steps?: ExecutiveDemoFlowNavigationStep[];
}

export function buildExecutiveDemoFlowNavigation(
  input: ExecutiveDemoFlowNavigationBuilderInput,
): ExecutiveDemoFlowNavigation {
  const flow = createExecutiveDemoFlowNavigation({
    organizationId: input.context.organizationId,
    companyName: input.context.companyName,
    title:
      input.title?.trim() ||
      `${input.context.companyName} Executive Demo Journey`,
    steps: input.steps ?? input.context.recommendedSteps,
  });

  assertExecutiveDemoFlowNavigationValid(flow);

  return flow;
}
