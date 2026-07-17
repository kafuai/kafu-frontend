import {
  buildExecutiveDemoIntelligenceActions,
  rankExecutiveDemoIntelligenceActions,
} from "./executiveDemoIntelligenceActions";
import {
  adaptExecutiveDemoIntelligenceInput,
  type ExecutiveDemoIntelligenceAdapterInput,
} from "./executiveDemoIntelligenceAdapter";
import {
  buildExecutiveDemoIntelligenceDecision,
  type ExecutiveDemoIntelligenceDecision,
} from "./executiveDemoIntelligenceDecision";
import {
  buildExecutiveDemoIntelligenceNarrative,
  type ExecutiveDemoIntelligenceNarrative,
} from "./executiveDemoIntelligenceNarrative";
import {
  runExecutiveDemoIntelligencePipeline,
} from "./executiveDemoIntelligencePipeline";
import type {
  ExecutiveDemoIntelligenceResult,
} from "./executiveDemoIntelligenceTypes";
import {
  buildExecutiveDemoIntelligenceViewModel,
  type ExecutiveDemoIntelligenceViewModel,
} from "./executiveDemoIntelligenceViewModel";
import type {
  ExecutiveDemoIntelligenceAction,
} from "./executiveDemoIntelligenceActions";

export interface ExecutiveDemoIntelligenceServiceResult {
  result: ExecutiveDemoIntelligenceResult;
  decision: ExecutiveDemoIntelligenceDecision;
  actions: ExecutiveDemoIntelligenceAction[];
  narrative: ExecutiveDemoIntelligenceNarrative;
  viewModel: ExecutiveDemoIntelligenceViewModel;
}

export class ExecutiveDemoIntelligenceService {
  execute(
    input: ExecutiveDemoIntelligenceAdapterInput,
  ): ExecutiveDemoIntelligenceServiceResult {
    const adaptedInput =
      adaptExecutiveDemoIntelligenceInput(input);

    const pipelineResult =
      runExecutiveDemoIntelligencePipeline(adaptedInput);

    const decision =
      buildExecutiveDemoIntelligenceDecision(
        pipelineResult.result,
      );

    const actions = rankExecutiveDemoIntelligenceActions(
      buildExecutiveDemoIntelligenceActions(decision),
    );

    const narrative =
      buildExecutiveDemoIntelligenceNarrative(
        pipelineResult.input.context,
        pipelineResult.result,
        decision,
        actions,
      );

    const viewModel =
      buildExecutiveDemoIntelligenceViewModel(
        pipelineResult.result,
        decision,
        narrative,
        actions,
      );

    return {
      result: pipelineResult.result,
      decision,
      actions,
      narrative,
      viewModel,
    };
  }
}

export function runExecutiveDemoIntelligence(
  input: ExecutiveDemoIntelligenceAdapterInput,
): ExecutiveDemoIntelligenceServiceResult {
  const service = new ExecutiveDemoIntelligenceService();

  return service.execute(input);
}
