import {
  EnterpriseContext,
} from "../intelligence/context";

import {
  IntelligenceRuntimeContextAssembler,
  IntelligenceRuntimeExecutor,
  IntelligenceRuntimeInput,
  IntelligenceRuntimeResult,
} from "./intelligenceRuntimeTypes";

export class IntelligenceRuntime {
  constructor(
    private readonly assemble: IntelligenceRuntimeContextAssembler,
    private readonly execute: IntelligenceRuntimeExecutor,
  ) {}

  run(
    input: IntelligenceRuntimeInput,
  ): IntelligenceRuntimeResult {
    const context: EnterpriseContext = this.assemble(input);

    const execution = this.execute(context);

    return {
      organizationId: input.organizationId,
      context,
      execution,
    };
  }
}