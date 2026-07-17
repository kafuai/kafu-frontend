import {
  EnterpriseDemoIntegration,
  EnterpriseDemoStateSnapshot,
} from "../enterprise-demo-integration";
import {
  EnterpriseDemoRuntimeContext,
} from "./enterpriseDemoRuntimeContext";

export interface EnterpriseDemoRuntimeResetResult {
  status: "ready";
  state: EnterpriseDemoStateSnapshot;
  resetAt: string;
}

export class EnterpriseDemoRuntimeReset {
  constructor(
    private readonly integration:
      EnterpriseDemoIntegration,
    private readonly context:
      EnterpriseDemoRuntimeContext,
  ) {}

  execute(): EnterpriseDemoRuntimeResetResult {
    const runtimeContext =
      this.context.getSnapshot();

    this.context.setStatus("resetting");

    this.integration.resetManager.reset();

    const state =
      this.integration.state.initialize({
        organizationId:
          runtimeContext.configuration
            .organizationId,
        workspaceId:
          runtimeContext.configuration
            .workspaceId,
        metadata: {
          ...(runtimeContext.configuration
            .metadata ?? {}),
          resetBy:
            runtimeContext.configuration
              .initiatedBy,
          resetAt:
            new Date().toISOString(),
        },
      });

    this.context.setState(state);
    this.context.setStatus("ready");

    return {
      status: "ready",
      state,
      resetAt: new Date().toISOString(),
    };
  }
}
