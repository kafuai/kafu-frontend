import { EnterprisePrompt } from "./promptTypes";

export function createEnterprisePrompt(
  prompt: EnterprisePrompt,
): EnterprisePrompt {
  return {
    ...prompt,
    content: prompt.content.trim(),
    metadata: {
      ...prompt.metadata,
      updatedAt: new Date().toISOString(),
    },
  };
}