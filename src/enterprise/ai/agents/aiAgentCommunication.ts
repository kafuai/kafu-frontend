export type AIAgentMessageType =
  | "instruction"
  | "status_update"
  | "handoff_request"
  | "decision"
  | "warning"
  | "result";

export interface AIAgentMessage {
  id: string;
  organizationId: string;
  fromAgentId: string;
  toAgentId?: string;
  teamId?: string;
  type: AIAgentMessageType;
  subject: string;
  body: string;
  createdAt: Date;
}

export class AIAgentCommunicationBus {
  private readonly messages: AIAgentMessage[] = [];

  publish(message: AIAgentMessage): AIAgentMessage {
    this.messages.push(message);
    return message;
  }

  list(): AIAgentMessage[] {
    return [...this.messages];
  }

  listForAgent(agentId: string): AIAgentMessage[] {
    return this.messages.filter(
      (message) =>
        message.fromAgentId === agentId || message.toAgentId === agentId,
    );
  }

  listForTeam(teamId: string): AIAgentMessage[] {
    return this.messages.filter((message) => message.teamId === teamId);
  }
}