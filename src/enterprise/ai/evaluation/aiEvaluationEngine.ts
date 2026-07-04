import { AIEvaluationRegistry } from "./aiEvaluationRegistry";
import { AIEvaluationRunner } from "./aiEvaluationRunner";
import {
  AIEvaluationRun,
  AIEvaluationScore,
} from "./aiEvaluationTypes";

export class AIEvaluationEngine {
  constructor(
    private readonly registry = new AIEvaluationRegistry(),
    private readonly runner = new AIEvaluationRunner(),
  ) {}

  execute(
    run: AIEvaluationRun,
    scoreProvider: (sampleId: string) => AIEvaluationScore[],
  ): AIEvaluationRun {
    this.registry.register(run);

    const completedRun = this.runner.run(run, scoreProvider);

    this.registry.register(completedRun);

    return completedRun;
  }

  getRun(id: string): AIEvaluationRun | undefined {
    return this.registry.get(id);
  }

  listRuns(): AIEvaluationRun[] {
    return this.registry.list();
  }

  listOrganizationRuns(
    organizationId: string,
  ): AIEvaluationRun[] {
    return this.registry.listByOrganization(
      organizationId,
    );
  }
}