export interface AIDecisionValidationIssue {
  code: string;
  message: string;
  severity: "info" | "warning" | "error";
}

export interface AIDecisionValidationResult {
  isValid: boolean;
  issues: AIDecisionValidationIssue[];
}