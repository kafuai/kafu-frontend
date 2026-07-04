import { EnterpriseContext } from "../intelligence/context";

export type IntelligenceExecutionResult = {
  organizationId: string;
  status: "completed" | "failed";
};

export type IntelligenceRuntimeInput = {
  organizationId: string;
};

export type IntelligenceRuntimeContextAssembler = (
  input: IntelligenceRuntimeInput,
) => EnterpriseContext;

export type IntelligenceRuntimeExecutor = (
  context: EnterpriseContext,
) => IntelligenceExecutionResult;

export type IntelligenceRuntimeResult = {
  organizationId: string;
  context: EnterpriseContext;
  execution: IntelligenceExecutionResult;
};