import { AITransparencyRecord } from "./aiTransparencyRecord";

export interface AITransparencyValidationIssue {
  field: string;
  message: string;
  severity: "warning" | "error";
}

export interface AITransparencyValidationResult {
  valid: boolean;
  issues: AITransparencyValidationIssue[];
}

export function validateAITransparencyRecord(
  record: AITransparencyRecord,
): AITransparencyValidationResult {
  const issues: AITransparencyValidationIssue[] = [];

  if (!record.title.trim()) {
    issues.push({
      field: "title",
      message: "Transparency record title is required.",
      severity: "error",
    });
  }

  if (!record.purpose.trim()) {
    issues.push({
      field: "purpose",
      message: "AI purpose must be clearly documented.",
      severity: "error",
    });
  }

  if (record.requiresUserDisclosure && !record.summary.trim()) {
    issues.push({
      field: "summary",
      message: "User-facing transparency summary is required.",
      severity: "error",
    });
  }

  if (
    (record.riskLevel === "high" || record.riskLevel === "critical") &&
    record.limitations.length === 0
  ) {
    issues.push({
      field: "limitations",
      message: "High-risk AI usage must document known limitations.",
      severity: "warning",
    });
  }

  if (
    record.requiresHumanReviewDisclosure &&
    record.disclosureLevel === "minimal"
  ) {
    issues.push({
      field: "disclosureLevel",
      message:
        "Human review disclosure should not use minimal disclosure level.",
      severity: "warning",
    });
  }

  return {
    valid: issues.every((issue) => issue.severity !== "error"),
    issues,
  };
}