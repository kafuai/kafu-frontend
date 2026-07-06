import { EnterpriseContext } from "../contextEngine";
import { assemblePrompt } from "./promptAssembly";
import { bindPromptContext } from "./promptContextBinding";
import { PromptInstruction } from "./promptInstruction";
import { PromptTemplate } from "./promptTemplate";

export interface PromptEngineInput {
  template: PromptTemplate;
  contexts: EnterpriseContext[];
  instructions: PromptInstruction[];
}

export interface PromptEngineOutput {
  prompt: string;
  contextCount: number;
  instructionCount: number;
  generatedAt: string;
}

export function buildEnterprisePrompt(
  input: PromptEngineInput,
): PromptEngineOutput {
  const renderedContext = bindPromptContext(
    input.template,
    input.contexts,
  );

  const prompt = assemblePrompt({
    template: input.template,
    instructions: input.instructions,
    renderedContext,
  });

  return {
    prompt,
    contextCount: input.contexts.length,
    instructionCount: input.instructions.length,
    generatedAt: new Date().toISOString(),
  };
}