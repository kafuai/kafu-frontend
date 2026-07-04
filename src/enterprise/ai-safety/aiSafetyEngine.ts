import { assessAISafety } from "./aiSafetyAssessment";
import { detectAISafetySignals } from "./aiSafetyDetector";
import { applyAISafetyPolicy } from "./aiSafetyPolicyEvaluator";
import {
  AISafetyPolicy,
  createDefaultAISafetyPolicy,
} from "./aiSafetyPolicy";
import { createAISafetyIncidentFromDecision } from "./aiSafetyIncident";
import { generateAISafetyRecommendations } from "./aiSafetyRecommendation";
import { generateAISafetyReport, AISafetyReport } from "./aiSafetyReport";

export interface RunAISafetyEngineInput {
  organizationId: string;
  requestId: string;
  modelId: string;
  inputText?: string;
  outputText?: string;
  policy?: AISafetyPolicy;
}

export function runAISafetyEngine(
  input: RunAISafetyEngineInput,
): AISafetyReport {
  const inputSignals = input.inputText
    ? detectAISafetySignals({
        text: input.inputText,
        source: "INPUT",
        requestId: input.requestId,
      })
    : [];

  const outputSignals = input.outputText
    ? detectAISafetySignals({
        text: input.outputText,
        source: "OUTPUT",
        requestId: input.requestId,
      })
    : [];

  const baseDecision = assessAISafety({
    organizationId: input.organizationId,
    requestId: input.requestId,
    modelId: input.modelId,
    inputText: input.inputText,
    outputText: input.outputText,
    signals: [...inputSignals, ...outputSignals],
  });

  const policy = input.policy ?? createDefaultAISafetyPolicy(input.organizationId);
  const finalDecision = applyAISafetyPolicy(baseDecision, policy);

  const incident = createAISafetyIncidentFromDecision(
    input.organizationId,
    input.requestId,
    input.modelId,
    finalDecision,
  );

  const recommendations = generateAISafetyRecommendations(
    finalDecision,
    input.requestId,
  );

  return generateAISafetyReport({
    organizationId: input.organizationId,
    requestId: input.requestId,
    modelId: input.modelId,
    decision: finalDecision,
    incident,
    recommendations,
  });
}