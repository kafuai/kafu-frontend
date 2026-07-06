export type PromptInstructionPriority =
  | "low"
  | "medium"
  | "high"
  | "critical";

export interface PromptInstruction {
  id: string;
  title: string;
  content: string;
  priority: PromptInstructionPriority;
  enabled: boolean;
}

export function getActiveInstructions(
  instructions: PromptInstruction[],
): PromptInstruction[] {
  return instructions
    .filter((instruction) => instruction.enabled)
    .sort((a, b) => {
      const order = { critical: 4, high: 3, medium: 2, low: 1 };
      return order[b.priority] - order[a.priority];
    });
}