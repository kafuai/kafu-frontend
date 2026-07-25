import type {
  CommunicationChannelAdapter,
} from "../communicationChannelAdapter";

import {
  CommunicationService,
  type CreateCommunicationConversationInput,
  type SendCommunicationMessageInput,
} from "../communicationService";

import type {
  CommunicationConversation,
  CommunicationMessage,
} from "../communicationTypes";

import type {
  CommunicationPermissionContext,
} from "../domain/permissionModels";

import {
  CommunicationAuthorizationService,
} from "./communicationAuthorizationService";

import {
  createConversationCreatedEvent,
  createDefaultCommunicationEventId,
  createMessageCreatedEvent,
  createMessageDeliveryEvent,
  type CommunicationEventIdFactory,
} from "./communicationDomainBridge";

import {
  NoopCommunicationDomainEventPublisher,
  type CommunicationDomainEventPublisher,
} from "./communicationDomainEventPublisher";

export interface AuthorizedCommunicationRequest {
  readonly permissionContext:
    CommunicationPermissionContext;
  readonly isResourceOwner?: boolean;
}

export class CommunicationApplicationService {
  constructor(
    private readonly service: CommunicationService,
    private readonly eventPublisher:
      CommunicationDomainEventPublisher =
        new NoopCommunicationDomainEventPublisher(),
    private readonly createEventId:
      CommunicationEventIdFactory =
        createDefaultCommunicationEventId,
    private readonly authorizationService:
      CommunicationAuthorizationService =
        new CommunicationAuthorizationService(),
  ) {}

  async createConversation(
    input: CreateCommunicationConversationInput,
  ): Promise<CommunicationConversation> {
    return this.createConversationInternal(input);
  }

  async createAuthorizedConversation(
    input: CreateCommunicationConversationInput,
    authorization: AuthorizedCommunicationRequest,
  ): Promise<CommunicationConversation> {
    this.authorizationService.assert({
      action: "conversation:create",
      context: authorization.permissionContext,
      isResourceOwner:
        authorization.isResourceOwner,
    });

    return this.createConversationInternal(input);
  }

  async createQueuedMessage(
    input: SendCommunicationMessageInput,
  ): Promise<CommunicationMessage> {
    return this.createQueuedMessageInternal(input);
  }

  async createAuthorizedQueuedMessage(
    input: SendCommunicationMessageInput,
    authorization: AuthorizedCommunicationRequest,
  ): Promise<CommunicationMessage> {
    this.authorizationService.assert({
      action: "message:create",
      context: authorization.permissionContext,
      isResourceOwner:
        authorization.isResourceOwner,
    });

    return this.createQueuedMessageInternal(input);
  }

  async dispatchMessage(
    input: SendCommunicationMessageInput,
    adapter: CommunicationChannelAdapter,
  ): Promise<CommunicationMessage> {
    return this.dispatchMessageInternal(
      input,
      adapter,
    );
  }

  async dispatchAuthorizedMessage(
    input: SendCommunicationMessageInput,
    adapter: CommunicationChannelAdapter,
    authorization: AuthorizedCommunicationRequest,
  ): Promise<CommunicationMessage> {
    this.authorizationService.assert({
      action: "message:create",
      context: authorization.permissionContext,
      isResourceOwner:
        authorization.isResourceOwner,
    });

    this.authorizationService.assert({
      action: "message:send",
      context: authorization.permissionContext,
      isResourceOwner:
        authorization.isResourceOwner,
    });

    return this.dispatchMessageInternal(
      input,
      adapter,
    );
  }

  async getConversation(
    companyId: string,
    conversationId: string,
  ): Promise<CommunicationConversation> {
    return this.service.getConversation(
      companyId,
      conversationId,
    );
  }

  async getAuthorizedConversation(
    companyId: string,
    conversationId: string,
    authorization: AuthorizedCommunicationRequest,
  ): Promise<CommunicationConversation> {
    this.authorizationService.assert({
      action: "conversation:read",
      context: authorization.permissionContext,
      isResourceOwner:
        authorization.isResourceOwner,
    });

    return this.service.getConversation(
      companyId,
      conversationId,
    );
  }

  private async createConversationInternal(
    input: CreateCommunicationConversationInput,
  ): Promise<CommunicationConversation> {
    const conversation =
      await this.service.createConversation(input);

    await this.eventPublisher.publish(
      createConversationCreatedEvent(
        conversation,
        this.createEventId(),
      ),
    );

    return conversation;
  }

  private async createQueuedMessageInternal(
    input: SendCommunicationMessageInput,
  ): Promise<CommunicationMessage> {
    const message =
      await this.service.createQueuedMessage(input);

    const conversation =
      await this.service.getConversation(
        input.companyId,
        input.conversationId,
      );

    await this.eventPublisher.publishMany([
      createMessageCreatedEvent(
        conversation,
        message,
        this.createEventId(),
      ),
      createMessageDeliveryEvent(
        conversation,
        message,
        this.createEventId(),
      ),
    ]);

    return message;
  }

  private async dispatchMessageInternal(
    input: SendCommunicationMessageInput,
    adapter: CommunicationChannelAdapter,
  ): Promise<CommunicationMessage> {
    const message =
      await this.service.dispatchMessage(
        input,
        adapter,
      );

    const conversation =
      await this.service.getConversation(
        input.companyId,
        input.conversationId,
      );

    await this.eventPublisher.publishMany([
      createMessageCreatedEvent(
        conversation,
        message,
        this.createEventId(),
      ),
      createMessageDeliveryEvent(
        conversation,
        message,
        this.createEventId(),
      ),
    ]);

    return message;
  }
}
