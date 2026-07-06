export type ConversationIntentType =
  | "question_answering"
  | "policy_explanation"
  | "document_search"
  | "workflow_guidance"
  | "decision_support"
  | "task_execution"
  | "general_assistance";

export interface ConversationIntent {
  readonly type: ConversationIntentType;
  readonly confidence: number;
  readonly keywords: readonly string[];
}

export function detectConversationIntent(content: string): ConversationIntent {
  const normalized = content.toLowerCase();

  if (normalized.includes("policy") || normalized.includes("سياسة")) {
    return {
      type: "policy_explanation",
      confidence: 0.82,
      keywords: ["policy"],
    };
  }

  if (
    normalized.includes("document") ||
    normalized.includes("file") ||
    normalized.includes("ملف")
  ) {
    return {
      type: "document_search",
      confidence: 0.8,
      keywords: ["document"],
    };
  }

  if (
    normalized.includes("workflow") ||
    normalized.includes("process") ||
    normalized.includes("إجراء")
  ) {
    return {
      type: "workflow_guidance",
      confidence: 0.78,
      keywords: ["workflow"],
    };
  }

  if (
    normalized.includes("decide") ||
    normalized.includes("recommend") ||
    normalized.includes("اقترح")
  ) {
    return {
      type: "decision_support",
      confidence: 0.76,
      keywords: ["decision"],
    };
  }

  return {
    type: "question_answering",
    confidence: 0.65,
    keywords: [],
  };
}