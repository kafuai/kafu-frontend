import {
  EnterpriseDemoIntegration,
  EnterpriseDemoStateSnapshot,
} from "../enterprise-demo-integration";
import {
  EnterpriseDemoRuntimeContext,
} from "./enterpriseDemoRuntimeContext";
import {
  EnterpriseDemoRuntimeStatus,
} from "./enterpriseDemoRuntimeTypes";

export interface EnterpriseDemoRuntimeLifecycleDependencies {
  integration: EnterpriseDemoIntegration;
  context: EnterpriseDemoRuntimeContext;
}

export class EnterpriseDemoRuntimeLifecycle {
  constructor(
    private readonly dependencies:
      EnterpriseDemoRuntimeLifecycleDependencies,
  ) {}

  transition(
    status: EnterpriseDemoRuntimeStatus,
  ): EnterpriseDemoStateSnapshot {
    const integrationStatus =
      this.toIntegrationStatus(status);

    const state =
      this.dependencies.integration.state.setStatus(
        integrationStatus,
      );

    this.dependencies.context.setState(state);
    this.dependencies.context.setStatus(status);

    return state;
  }

  complete(): EnterpriseDemoStateSnapshot {
    return this.transition("completed");
  }

  fail(
    error: unknown,
  ): EnterpriseDemoStateSnapshot {
    this.dependencies.context.fail(error);

    return this.dependencies.integration.state.setStatus(
      "failed",
    );
  }

  reset(): EnterpriseDemoStateSnapshot {
    this.dependencies.context.setStatus(
      "resetting",
    );

    const state =
      this.dependencies.integration.state.reset();

    this.dependencies.context.setState(state);
    this.dependencies.context.setStatus("ready");

    return state;
  }

  private toIntegrationStatus(
    status: EnterpriseDemoRuntimeStatus,
  ):
    | "idle"
    | "bootstrapping"
    | "ready"
    | "running"
    | "completed"
    | "failed"
    | "resetting" {
    switch (status) {
      case "initializing":
        return "bootstrapping";
      case "executing":
        return "running";
      default:
        return status;
    }
  }
}
