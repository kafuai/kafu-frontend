import {
  addAIAgentConversationMessage,
  AIAgentConversation,
} from "./aiAgentConversation";
import { AIAgentConversationMessage } from "./aiAgentConversationMessage";

export class AIAgentConversationBus {
  private readonly conversations = new Map<string, AIAgentConversation>();

  register(conversation: AIAgentConversation): void {
    this.conversations.set(conversation.id, conversation);
  }

  require(conversationId: string): AIAgentConversation {
    const conversation = this.conversations.get(conversationId);

    if (!conversation) {
      throw new Error(
        `Conversation not found: ${conversationId}`,
      );
    }

    return conversation;
  }

  publish(message: AIAgentConversationMessage): void {
    const conversation = this.require(message.conversationId);

    this.conversations.set(
      conversation.id,
      addAIAgentConversationMessage(conversation, message),
    );
  }

  history(conversationId: string): AIAgentConversationMessage[] {
    return this.require(conversationId).messages;
  }

  clear(): void {
    this.conversations.clear();
  }
}