import type { ConversationMessage } from "./conversationMessage";
import type { ConversationSession } from "./conversationSession";

export interface ConversationState {
  readonly session: ConversationSession;
  readonly messages: readonly ConversationMessage[];
  readonly updatedAt: string;
}

export function createConversationState(input: {
  readonly session: ConversationSession;
  readonly messages?: readonly ConversationMessage[];
  readonly updatedAt?: string;
}): ConversationState {
  return {
    session: input.session,
    messages: input.messages ?? [],
    updatedAt: input.updatedAt ?? new Date().toISOString(),
  };
}

export function appendConversationStateMessage(
  state: ConversationState,
  message: ConversationMessage,
  updatedAt: string = new Date().toISOString(),
): ConversationState {
  return {
    ...state,
    messages: [...state.messages, message],
    updatedAt,
  };
}