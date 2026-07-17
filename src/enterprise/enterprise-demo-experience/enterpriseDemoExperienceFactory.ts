import {
  CreateEnterpriseDemoRuntimeOptions,
  EnterpriseDemoRuntime,
  createEnterpriseDemoRuntime,
} from "../enterprise-demo-runtime";
import {
  EnterpriseDemoExperienceContext,
} from "./enterpriseDemoExperienceContext";
import {
  EnterpriseDemoExperienceService,
} from "./enterpriseDemoExperienceService";

export interface EnterpriseDemoExperience {
  runtime: EnterpriseDemoRuntime;
  context: EnterpriseDemoExperienceContext;
  service: EnterpriseDemoExperienceService;
}

export interface CreateEnterpriseDemoExperienceOptions
  extends Omit<
    CreateEnterpriseDemoRuntimeOptions,
    "context"
  > {
  runtime?: EnterpriseDemoRuntime;
  experienceContext?: EnterpriseDemoExperienceContext;
}

export function createEnterpriseDemoExperience(
  options: CreateEnterpriseDemoExperienceOptions = {},
): EnterpriseDemoExperience {
  const runtime =
    options.runtime ??
    createEnterpriseDemoRuntime({
      integration: options.integration,
      stepExecutor: options.stepExecutor,
    });

  const context =
    options.experienceContext ??
    new EnterpriseDemoExperienceContext();

  const service =
    new EnterpriseDemoExperienceService({
      runtime: runtime.service,
      context,
    });

  return {
    runtime,
    context,
    service,
  };
}

export class EnterpriseDemoExperienceFactory {
  static create(
    options: CreateEnterpriseDemoExperienceOptions = {},
  ): EnterpriseDemoExperience {
    return createEnterpriseDemoExperience(
      options,
    );
  }
}
