import {
  CreateEnterpriseDemoIntegrationOptions,
  EnterpriseDemoIntegration,
  createEnterpriseDemoIntegration,
} from "../enterprise-demo-integration";
import {
  EnterpriseDemoRuntimeContext,
} from "./enterpriseDemoRuntimeContext";
import {
  EnterpriseDemoRuntimeController,
} from "./enterpriseDemoRuntimeController";
import {
  EnterpriseDemoRuntimeService,
} from "./enterpriseDemoRuntimeService";

export interface EnterpriseDemoRuntime {
  integration: EnterpriseDemoIntegration;
  context: EnterpriseDemoRuntimeContext;
  controller: EnterpriseDemoRuntimeController;
  service: EnterpriseDemoRuntimeService;
}

export interface CreateEnterpriseDemoRuntimeOptions
  extends CreateEnterpriseDemoIntegrationOptions {
  integration?: EnterpriseDemoIntegration;
  context?: EnterpriseDemoRuntimeContext;
}

export function createEnterpriseDemoRuntime(
  options: CreateEnterpriseDemoRuntimeOptions = {},
): EnterpriseDemoRuntime {
  const integration =
    options.integration ??
    createEnterpriseDemoIntegration({
      stepExecutor: options.stepExecutor,
    });

  const context =
    options.context ??
    new EnterpriseDemoRuntimeContext();

  const controller =
    new EnterpriseDemoRuntimeController({
      integration,
      context,
    });

  const service =
    new EnterpriseDemoRuntimeService({
      integration,
      controller,
    });

  return {
    integration,
    context,
    controller,
    service,
  };
}

export class EnterpriseDemoRuntimeFactory {
  static create(
    options: CreateEnterpriseDemoRuntimeOptions = {},
  ): EnterpriseDemoRuntime {
    return createEnterpriseDemoRuntime(options);
  }
}
