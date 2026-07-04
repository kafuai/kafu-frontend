import { assessAISafety, AISafetyAssessmentInput } from "./aiSafetyAssessment";
import { detectAISafetySignals } from "./aiSafetyDetector";
import { AISafetyDecision } from "./aiSafetyTypes";

export interface AISafetyGuardrailInput {
  organizationId: string;
  requestId: string;
  modelId: string;
  inputText?: string;
  outputText?: string;
}

export function evaluateAISafetyGuardrail(
  input: AISafetyGuardrailInput,
): AISafetyDecision {
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

  const assessmentInput: AISafetyAssessmentInput = {
    organizationId: input.organizationId,
    requestId: input.requestId,
    modelId: input.modelId,
    inputText: input.inputText,
    outputText: input.outputText,
    signals: [...inputSignals, ...outputSignals],
  };

  return assessAISafety(assessmentInput);
}