import { PromptInstruction, getActiveInstructions } from "./promptInstruction";
import { PromptTemplate } from "./promptTemplate";

export interface PromptAssemblyInput {
  template: PromptTemplate;
  instructions: PromptInstruction[];
  renderedContext: string;
}

export function assemblePrompt(
  input: PromptAssemblyInput,
): string {
  const instructions = getActiveInstructions(input.instructions)
    .map((instruction) => instruction.content)
    .join("\n");

  return [
    instructions,
    "",
    input.renderedContext,
    "",
    input.template.template,
  ]
    .filter(Boolean)
    .join("\n");
}