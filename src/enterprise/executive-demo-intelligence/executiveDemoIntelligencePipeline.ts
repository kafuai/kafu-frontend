import {
  buildExecutiveDemoContextKnowledge,
  rankExecutiveDemoIntelligenceKnowledge,
} from "./executiveDemoIntelligenceKnowledge";
import {
  buildDefaultExecutiveDemoObjectives,
  rankExecutiveDemoIntelligenceObjectives,
} from "./executiveDemoIntelligenceObjectives";
import {
  deriveExecutiveDemoIntelligenceSignals,
  rankExecutiveDemoIntelligenceSignals,
} from "./executiveDemoIntelligenceSignals";
import { ExecutiveDemoIntelligenceEngine } from "./executiveDemoIntelligenceEngine";
import type {
  ExecutiveDemoIntelligenceInput,
  ExecutiveDemoIntelligenceResult,
} from "./executiveDemoIntelligenceTypes";

export interface ExecutiveDemoIntelligencePipelineResult {
  input: ExecutiveDemoIntelligenceInput;
  result: ExecutiveDemoIntelligenceResult;
}

export function runExecutiveDemoIntelligencePipeline(
  input: ExecutiveDemoIntelligenceInput,
): ExecutiveDemoIntelligencePipelineResult {
  const derivedSignals =
    deriveExecutiveDemoIntelligenceSignals(input.context);

  const signals = rankExecutiveDemoIntelligenceSignals([
    ...derivedSignals,
    ...(input.signals ?? []),
  ]);

  const derivedKnowledge =
    buildExecutiveDemoContextKnowledge(input.context);

  const knowledge = rankExecutiveDemoIntelligenceKnowledge([
    ...derivedKnowledge,
    ...(input.knowledge ?? []),
  ]);

  const derivedObjectives =
    buildDefaultExecutiveDemoObjectives(input.context);

  const objectives = rankExecutiveDemoIntelligenceObjectives([
    ...derivedObjectives,
    ...(input.objectives ?? []),
  ]);

  const normalizedInput: ExecutiveDemoIntelligenceInput = {
    context: input.context,
    signals,
    knowledge,
    memory: input.memory ?? [],
    objectives,
  };

  const engine = new ExecutiveDemoIntelligenceEngine();
  const result = engine.generate(normalizedInput);

  return {
    input: normalizedInput,
    result,
  };
}
