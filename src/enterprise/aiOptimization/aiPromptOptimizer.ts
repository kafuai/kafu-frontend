import { AIOptimizationMetricSnapshot } from "./aiOptimizationTypes";

export interface AIPromptOptimizationInput {
  promptId: string;
  organizationId: string;
  prompt: string;
  objective: "quality" | "accuracy" | "cost" | "latency" | "safety";
  currentMetrics?: AIOptimizationMetricSnapshot;
  requiredInstructions?: string[];
  forbiddenInstructions?: string[];
}

export interface AIPromptOptimizationResult {
  promptId: string;
  organizationId: string;
  optimizedPrompt: string;
  changes: string[];
  expectedImprovements: string[];
  riskNotes: string[];
  createdAt: Date;
}

export function optimizeAIPrompt(
  input: AIPromptOptimizationInput,
): AIPromptOptimizationResult {
  const changes: string[] = [];
  const expectedImprovements: string[] = [];
  const riskNotes: string[] = [];

  let optimizedPrompt = input.prompt.trim();

  if (!optimizedPrompt.includes("Goal:")) {
    optimizedPrompt = `Goal:\n${optimizedPrompt}`;
    changes.push("Added explicit goal structure.");
    expectedImprovements.push("Improves instruction clarity and response consistency.");
  }

  if (input.objective === "accuracy" || input.objective === "safety") {
    optimizedPrompt +=
      "\n\nValidation:\n- Check assumptions before answering.\n- Do not fabricate missing information.\n- State uncertainty when evidence is incomplete.";
    changes.push("Added validation and uncertainty handling.");
    expectedImprovements.push("Reduces hallucination and improves trustworthiness.");
  }

  if (input.objective === "cost" || input.objective === "latency") {
    optimizedPrompt +=
      "\n\nEfficiency:\n- Prefer concise reasoning.\n- Avoid unnecessary repetition.\n- Use only relevant context.";
    changes.push("Added efficiency constraints.");
    expectedImprovements.push("Reduces token usage and improves latency.");
  }

  if (input.requiredInstructions?.length) {
    optimizedPrompt += `\n\nRequired Instructions:\n${input.requiredInstructions
      .map((instruction) => `- ${instruction}`)
      .join("\n")}`;
    changes.push("Added required enterprise instructions.");
  }

  if (input.forbiddenInstructions?.length) {
    optimizedPrompt += `\n\nForbidden Behavior:\n${input.forbiddenInstructions
      .map((instruction) => `- ${instruction}`)
      .join("\n")}`;
    changes.push("Added forbidden behavior constraints.");
  }

  if ((input.currentMetrics?.hallucinationRate ?? 0) > 0.05) {
    riskNotes.push("High hallucination rate detected. Add evaluation gate before deployment.");
  }

  return {
    promptId: input.promptId,
    organizationId: input.organizationId,
    optimizedPrompt,
    changes,
    expectedImprovements,
    riskNotes,
    createdAt: new Date(),
  };
}