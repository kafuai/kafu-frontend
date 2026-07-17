import {
  EnterpriseDemoIntegration,
} from "../enterprise-demo-integration";
import {
  EnterpriseDemoRuntimeController,
} from "./enterpriseDemoRuntimeController";
import {
  EnterpriseDemoRuntimeDiagnostics,
  EnterpriseDemoRuntimeDiagnosticReport,
} from "./enterpriseDemoRuntimeDiagnostics";
import {
  EnterpriseDemoRuntimeReset,
  EnterpriseDemoRuntimeResetResult,
} from "./enterpriseDemoRuntimeReset";
import {
  EnterpriseDemoRuntimeSnapshot,
  EnterpriseDemoRuntimeSnapshotBuilder,
} from "./enterpriseDemoRuntimeSnapshot";
import {
  EnterpriseDemoRuntimeExecutionInput,
  EnterpriseDemoRuntimeExecutionResult,
  EnterpriseDemoRuntimeInitializationInput,
  EnterpriseDemoRuntimeInitializationResult,
} from "./enterpriseDemoRuntimeTypes";

export interface EnterpriseDemoRuntimeServiceDependencies {
  integration: EnterpriseDemoIntegration;
  controller: EnterpriseDemoRuntimeController;
}

export class EnterpriseDemoRuntimeService {
  private readonly diagnostics:
    EnterpriseDemoRuntimeDiagnostics;

  private readonly resetManager:
    EnterpriseDemoRuntimeReset;

  private readonly snapshotBuilder =
    new EnterpriseDemoRuntimeSnapshotBuilder();

  constructor(
    private readonly dependencies:
      EnterpriseDemoRuntimeServiceDependencies,
  ) {
    const context =
      dependencies.controller.getContext();

    this.diagnostics =
      new EnterpriseDemoRuntimeDiagnostics(
        dependencies.integration.diagnostics,
        context,
      );

    this.resetManager =
      new EnterpriseDemoRuntimeReset(
        dependencies.integration,
        context,
      );
  }

  initialize(
    input: EnterpriseDemoRuntimeInitializationInput,
  ): EnterpriseDemoRuntimeInitializationResult {
    return this.dependencies.controller.initialize(
      input,
    );
  }

  execute(
    input: EnterpriseDemoRuntimeExecutionInput,
  ): Promise<EnterpriseDemoRuntimeExecutionResult> {
    return this.dependencies.controller.execute(
      input,
    );
  }

  getSnapshot(): EnterpriseDemoRuntimeSnapshot {
    const context =
      this.dependencies.controller
        .getContext()
        .getSnapshot();

    if (!context.state) {
      throw new Error(
        "Enterprise demo runtime state is not available.",
      );
    }

    return this.snapshotBuilder.build(
      context.state,
      context.status,
    );
  }

  runDiagnostics():
    EnterpriseDemoRuntimeDiagnosticReport {
    return this.diagnostics.run();
  }

  reset(): EnterpriseDemoRuntimeResetResult {
    return this.resetManager.execute();
  }

  getController():
    EnterpriseDemoRuntimeController {
    return this.dependencies.controller;
  }

  getIntegration():
    EnterpriseDemoIntegration {
    return this.dependencies.integration;
  }
}
