import { EnterpriseContext } from "../contextEngine";
import { PromptTemplate } from "./promptTemplate";

export interface PromptContextBinding {
  templateId: string;
  contextIds: string[];
}

export function bindPromptContext(
  template: PromptTemplate,
  contexts: EnterpriseContext[],
): string {
  let result = template.template;

  for (const context of contexts) {
    result = result.replaceAll(
      `{{context:${context.name}}}`,
      context.description,
    );
  }

  return result;
}