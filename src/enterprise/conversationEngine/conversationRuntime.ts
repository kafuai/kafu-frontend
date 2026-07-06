import {
  addMessageToConversationStore,
  addSessionToConversationStore,
  createConversationStore,
  findSessionInConversationStore,
  listMessagesForConversation,
  type ConversationStore,
} from "./conversationStore";
import { createEnterpriseConversation } from "./conversationFactory";
import { orchestrateConversationTurn } from "./conversationOrchestrator";
import type { ConversationMessage } from "./conversationMessage";
import type { ConversationSession } from "./conversationSession";
import type {
  ConversationChannel,
  ConversationConfiguration,
  ConversationParticipant,
  ConversationPriority,
} from "./conversationTypes";

export interface ConversationRuntime {
  readonly store: ConversationStore;
}

export function createConversationRuntime(
  store: ConversationStore = createConversationStore(),
): ConversationRuntime {
  return {
    store,
  };
}

export function startEnterpriseConversation(input: {
  readonly runtime: ConversationRuntime;
  readonly id: string;
  readonly title: string;
  readonly tenantId: string;
  readonly organizationId: string;
  readonly startedBy: string;
  readonly channel: ConversationChannel;
  readonly participants: readonly ConversationParticipant[];
  readonly openingMessage?: string;
  readonly configuration?: Partial<ConversationConfiguration>;
  readonly priority?: ConversationPriority;
  readonly now?: string;
}): {
  readonly runtime: ConversationRuntime;
  readonly session: ConversationSession;
  readonly openingMessage?: ConversationMessage;
} {
  const conversation = createEnterpriseConversation(input);

  let store = addSessionToConversationStore(
    input.runtime.store,
    conversation.session,
  );

  if (conversation.openingMessage) {
    store = addMessageToConversationStore(store, conversation.openingMessage);
  }

  return {
    runtime: {
      store,
    },
    session: conversation.session,
    openingMessage: conversation.openingMessage,
  };
}

export function runEnterpriseConversationTurn(input: {
  readonly runtime: ConversationRuntime;
  readonly conversationId: string;
  readonly turnId: string;
  readonly userMessageId: string;
  readonly assistantMessageId: string;
  readonly userContent: string;
  readonly assistantContent: string;
  readonly now?: string;
}): {
  readonly runtime: ConversationRuntime;
  readonly session: ConversationSession;
  readonly userMessage: ConversationMessage;
  readonly assistantMessage: ConversationMessage | undefined;
} {
  const session = findSessionInConversationStore(
    input.runtime.store,
    input.conversationId,
  );

  if (!session) {
    throw new Error(`Conversation session not found: ${input.conversationId}`);
  }

  const messages = listMessagesForConversation(
    input.runtime.store,
    input.conversationId,
  );

  const result = orchestrateConversationTurn({
    session,
    messages,
    turnId: input.turnId,
    userMessageId: input.userMessageId,
    assistantMessageId: input.assistantMessageId,
    userContent: input.userContent,
    assistantContent: input.assistantContent,
    now: input.now,
  });

  let store = addMessageToConversationStore(
    input.runtime.store,
    result.turn.userMessage,
  );

  if (result.turn.assistantMessage) {
    store = addMessageToConversationStore(store, result.turn.assistantMessage);
  }

  return {
    runtime: {
      store,
    },
    session,
    userMessage: result.turn.userMessage,
    assistantMessage: result.turn.assistantMessage,
  };
}