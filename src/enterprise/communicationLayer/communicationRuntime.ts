import {
  CommunicationChannelRegistry,
  type CommunicationChannelAdapter,
} from "./communicationChannelAdapter";

import {
  CommunicationService,
  type SendCommunicationMessageInput,
} from "./communicationService";

import {
  communicationRepository,
} from "./supabaseCommunicationRepository";

import {
  communicationAuditWriter,
} from "./supabaseCommunicationAuditWriter";

import type {
  CommunicationChannel,
  CommunicationMessage,
} from "./communicationTypes";

import type {
  CommunicationPermissionContext,
} from "./domain/permissionModels";

import {
  AuditCommunicationDomainEventPublisher,
} from "./application/auditCommunicationDomainEventPublisher";

import {
  CommunicationApplicationService,
} from "./application/communicationApplicationService";

import {
  CommunicationAuthorizationService,
} from "./application/communicationAuthorizationService";

import type {
  CommunicationDomainEventPublisher,
} from "./application/communicationDomainEventPublisher";

export interface CommunicationRuntimeAuthorization {
  readonly permissionContext:
    CommunicationPermissionContext;
  readonly isResourceOwner?: boolean;
}

export interface CommunicationRuntimeOptions {
  readonly service?: CommunicationService;
  readonly applicationService?:
    CommunicationApplicationService;
  readonly authorizationService?:
    CommunicationAuthorizationService;
  readonly eventPublisher?:
    CommunicationDomainEventPublisher;
  readonly adapters?:
    readonly CommunicationChannelAdapter[];
}

export class CommunicationRuntime {
  readonly channels: CommunicationChannelRegistry;
  readonly service: CommunicationService;
  readonly authorization:
    CommunicationAuthorizationService;
  readonly application:
    CommunicationApplicationService;

  constructor(
    input: CommunicationRuntimeOptions = {},
  ) {
    this.service =
      input.service ??
      new CommunicationService(
        communicationRepository,
      );

    this.authorization =
      input.authorizationService ??
      new CommunicationAuthorizationService();

    const eventPublisher =
      input.eventPublisher ??
      new AuditCommunicationDomainEventPublisher(
        communicationAuditWriter,
      );

    this.application =
      input.applicationService ??
      new CommunicationApplicationService(
        this.service,
        eventPublisher,
        undefined,
        this.authorization,
      );

    this.channels =
      new CommunicationChannelRegistry();

    for (const adapter of input.adapters ?? []) {
      this.channels.register(adapter);
    }
  }

  registerChannel(
    adapter: CommunicationChannelAdapter,
  ): void {
    this.channels.register(adapter);
  }

  supportsChannel(
    channel: CommunicationChannel,
  ): boolean {
    return this.channels.has(channel);
  }

  async send(
    input: SendCommunicationMessageInput,
  ): Promise<CommunicationMessage> {
    const conversation =
      await this.application.getConversation(
        input.companyId,
        input.conversationId,
      );

    const adapter =
      this.channels.get(conversation.channel);

    return this.application.dispatchMessage(
      input,
      adapter,
    );
  }

  async sendAuthorized(
    input: SendCommunicationMessageInput,
    authorization:
      CommunicationRuntimeAuthorization,
  ): Promise<CommunicationMessage> {
    const conversation =
      await this.application.getAuthorizedConversation(
        input.companyId,
        input.conversationId,
        authorization,
      );

    const adapter =
      this.channels.get(conversation.channel);

    return this.application.dispatchAuthorizedMessage(
      input,
      adapter,
      authorization,
    );
  }
}

export function createCommunicationRuntime(
  options: CommunicationRuntimeOptions = {},
): CommunicationRuntime {
  return new CommunicationRuntime(options);
}

export const communicationRuntime =
  createCommunicationRuntime();
