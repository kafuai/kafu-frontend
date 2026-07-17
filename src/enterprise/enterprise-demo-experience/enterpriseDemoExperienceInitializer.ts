import {
  EnterpriseDemoRuntimeInitializationResult,
  EnterpriseDemoRuntimeService,
} from "../enterprise-demo-runtime";
import {
  EnterpriseDemoExperienceContext,
} from "./enterpriseDemoExperienceContext";
import {
  EnterpriseDemoExperienceScenarioMapper,
} from "./enterpriseDemoExperienceScenarioMapper";
import {
  EnterpriseDemoExperienceInitializationInput,
  EnterpriseDemoExperienceState,
} from "./enterpriseDemoExperienceTypes";
import {
  EnterpriseDemoExperienceValidator,
} from "./enterpriseDemoExperienceValidator";

export interface EnterpriseDemoExperienceInitializerDependencies {
  runtime: EnterpriseDemoRuntimeService;
  context: EnterpriseDemoExperienceContext;
  validator?: EnterpriseDemoExperienceValidator;
  scenarioMapper?: EnterpriseDemoExperienceScenarioMapper;
}

export interface EnterpriseDemoExperienceInitializationResult {
  experience: EnterpriseDemoExperienceState;
  runtime: EnterpriseDemoRuntimeInitializationResult;
}

export class EnterpriseDemoExperienceInitializer {
  private readonly validator:
    EnterpriseDemoExperienceValidator;

  private readonly scenarioMapper:
    EnterpriseDemoExperienceScenarioMapper;

  constructor(
    private readonly dependencies:
      EnterpriseDemoExperienceInitializerDependencies,
  ) {
    this.validator =
      dependencies.validator ??
      new EnterpriseDemoExperienceValidator();

    this.scenarioMapper =
      dependencies.scenarioMapper ??
      new EnterpriseDemoExperienceScenarioMapper();
  }

  initialize(
    input: EnterpriseDemoExperienceInitializationInput,
  ): EnterpriseDemoExperienceInitializationResult {
    this.validator.validateConfiguration(
      input.configuration,
    );

    this.validator.validateScenarios(
      input.scenarios ?? [],
    );

    const integration =
      this.dependencies.runtime.getIntegration();

    const runtimeScenarios =
      integration.scenarioRegistry.list({
        organizationId:
          input.configuration.organizationId,
        includeDisabled: true,
      });

    const scenarios =
      input.scenarios &&
      input.scenarios.length > 0
        ? input.scenarios
        : this.scenarioMapper.mapMany(
            runtimeScenarios,
          );

    const runtime =
      this.dependencies.runtime.initialize({
        configuration: {
          organizationId:
            input.configuration.organizationId,
          workspaceId:
            input.configuration.workspaceId,
          environment: "development",
          autoStart: false,
          enableDiagnostics: true,
          enableDataInjection: true,
          enableReset: true,
          initiatedBy:
            input.configuration.initiatedBy,
          defaultScenarioId:
            input.configuration
              .defaultScenarioId ??
            undefined,
          metadata: {
            ...(input.configuration.metadata ?? {}),
            experienceMode:
              input.configuration.mode,
          },
        },
        scenarios: runtimeScenarios,
      });

    const experience =
      this.dependencies.context.initialize(
        input.configuration,
        scenarios,
      );

    this.dependencies.context.setRuntimeStatus(
      runtime.status,
    );

    return {
      experience:
        this.dependencies.context.getSnapshot(),
      runtime,
    };
  }
}

