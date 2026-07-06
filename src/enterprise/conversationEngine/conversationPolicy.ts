import type { ConversationIntent } from "./conversationIntent";
import type { ConversationSession } from "./conversationSession";

export interface ConversationPolicyDecision {
  readonly allowed: boolean;
  readonly reason: string;
  readonly requiresRetrieval: boolean;
  readonly requiresReasoning: boolean;
  readonly allowsToolCalling: boolean;
}

export function evaluateConversationPolicy(input: {
  readonly session: ConversationSession;
  readonly intent: ConversationIntent;
}): ConversationPolicyDecision {
  if (input.session.status !== "active") {
    return {
      allowed: false,
      reason: "Conversation session is not active.",
      requiresRetrieval: false,
      requiresReasoning: false,
      allowsToolCalling: false,
    };
  }

  return {
    allowed: true,
    reason: "Conversation is allowed.",
    requiresRetrieval:
      input.session.configuration.retrievalEnabled &&
      ["document_search", "policy_explanation"].includes(input.intent.type),
    requiresReasoning:
      input.session.configuration.reasoningEnabled &&
      ["decision_support", "workflow_guidance", "question_answering"].includes(
        input.intent.type,
      ),
    allowsToolCalling: input.session.configuration.toolCallingEnabled,
  };
}