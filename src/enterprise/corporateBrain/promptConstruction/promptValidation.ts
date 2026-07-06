import { PromptTemplate } from "./promptTemplate";

export interface PromptValidationResult {
  valid: boolean;
  errors: string[];
}

export function validatePromptTemplate(
  template: PromptTemplate,
): PromptValidationResult {
  const errors: string[] = [];

  if (!template.id.trim()) errors.push("Template id is required.");
  if (!template.name.trim()) errors.push("Template name is required.");
  if (!template.template.trim()) errors.push("Template content is required.");
  if (!template.metadata.tenantId.trim()) {
    errors.push("Tenant id is required.");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}