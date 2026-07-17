import {
  EnterpriseDemoRuntimeService,
} from "../enterprise-demo-runtime";
import {
  EnterpriseDemoExperienceContext,
} from "./enterpriseDemoExperienceContext";
import {
  EnterpriseDemoExperienceInitializer,
  EnterpriseDemoExperienceInitializationResult,
} from "./enterpriseDemoExperienceInitializer";
import {
  EnterpriseDemoExperienceExecutionInput,
  EnterpriseDemoExperienceExecutionResult,
  EnterpriseDemoExperienceOrchestrator,
} from "./enterpriseDemoExperienceOrchestrator";
import {
  EnterpriseDemoExperienceInitializationInput,
  EnterpriseDemoExperienceState,
} from "./enterpriseDemoExperienceTypes";
import {
  EnterpriseDemoExperienceViewModel,
  EnterpriseDemoExperienceViewModelBuilder,
} from "./enterpriseDemoExperienceViewModel";

export interface EnterpriseDemoExperienceServiceDependencies {
  runtime: EnterpriseDemoRuntimeService;
  context: EnterpriseDemoExperienceContext;
}

export class EnterpriseDemoExperienceService {
  private readonly initializer:
    EnterpriseDemoExperienceInitializer;

  private readonly orchestrator:
    EnterpriseDemoExperienceOrchestrator;

  private readonly viewModelBuilder =
    new EnterpriseDemoExperienceViewModelBuilder();

  constructor(
    private readonly dependencies:
      EnterpriseDemoExperienceServiceDependencies,
  ) {
    this.initializer =
      new EnterpriseDemoExperienceInitializer({
        runtime: dependencies.runtime,
        context: dependencies.context,
      });

    this.orchestrator =
      new EnterpriseDemoExperienceOrchestrator({
        runtime: dependencies.runtime,
        context: dependencies.context,
      });
  }

  initialize(
    input: EnterpriseDemoExperienceInitializationInput,
  ): EnterpriseDemoExperienceInitializationResult {
    return this.initializer.initialize(input);
  }

  selectScenario(
    scenarioId: string,
  ): EnterpriseDemoExperienceState {
    return this.dependencies.context.selectScenario(
      scenarioId,
    );
  }

  execute(
    input: EnterpriseDemoExperienceExecutionInput,
  ): Promise<EnterpriseDemoExperienceExecutionResult> {
    return this.orchestrator.execute(input);
  }

  getState():
    EnterpriseDemoExperienceState {
    return this.dependencies.context.getSnapshot();
  }

  getViewModel():
    EnterpriseDemoExperienceViewModel {
    return this.viewModelBuilder.build(
      this.getState(),
    );
  }

  reset():
    EnterpriseDemoExperienceState {
    this.dependencies.runtime.reset();

    return this.dependencies.context.reset();
  }
}
