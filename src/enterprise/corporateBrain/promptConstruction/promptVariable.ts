export type PromptVariableType =
  | "text"
  | "number"
  | "boolean"
  | "date"
  | "json"
  | "context";

export interface PromptVariable {
  key: string;
  type: PromptVariableType;
  required: boolean;
  description: string;
  defaultValue?: string;
}

export function resolvePromptVariable(
  variable: PromptVariable,
  values: Record<string, string>,
): string {
  const value = values[variable.key] ?? variable.defaultValue;

  if (variable.required && value === undefined) {
    throw new Error(`Missing required prompt variable: ${variable.key}`);
  }

  return value ?? "";
}