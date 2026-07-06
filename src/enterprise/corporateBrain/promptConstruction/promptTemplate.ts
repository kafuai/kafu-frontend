import { PromptMetadata } from "./promptTypes";

export interface PromptTemplate {
  id: string;
  name: string;
  description: string;
  template: string;
  metadata: PromptMetadata;
}

export function createPromptTemplate(input: PromptTemplate): PromptTemplate {
  return {
    ...input,
    template: input.template.trim(),
  };
}