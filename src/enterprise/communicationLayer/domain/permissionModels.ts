import type {
  CommunicationChannelKind,
} from "./channelDefinitions";

import type {
  CommunicationConversationType,
  CommunicationId,
  CommunicationParticipantRole,
  CommunicationParticipantType,
} from "./communicationTypes";

export type CommunicationPermissionAction =
  | "conversation:create"
  | "conversation:read"
  | "conversation:update"
  | "conversation:resolve"
  | "conversation:archive"
  | "conversation:delete"
  | "participant:add"
  | "participant:update"
  | "participant:remove"
  | "message:create"
  | "message:read"
  | "message:update"
  | "message:delete"
  | "message:send"
  | "attachment:create"
  | "attachment:read"
  | "attachment:delete"
  | "channel:use"
  | "channel:configure"
  | "audit:read";

export type CommunicationPermissionEffect =
  | "allow"
  | "deny";

export interface CommunicationPermissionSubject {
  readonly participantId: CommunicationId;
  readonly participantType: CommunicationParticipantType;
  readonly role: CommunicationParticipantRole;
}

export interface CommunicationPermissionResource {
  readonly conversationId?: CommunicationId;
  readonly conversationType?: CommunicationConversationType;
  readonly messageId?: CommunicationId;
  readonly attachmentId?: CommunicationId;
  readonly channel?: CommunicationChannelKind;
}

export interface CommunicationPermissionContext {
  readonly companyId: CommunicationId;
  readonly tenantId: CommunicationId;
  readonly organizationId: CommunicationId;
  readonly subject: CommunicationPermissionSubject;
  readonly resource?: CommunicationPermissionResource;
}

export interface CommunicationPermissionRule {
  readonly id: CommunicationId;
  readonly action: CommunicationPermissionAction;
  readonly effect: CommunicationPermissionEffect;
  readonly participantTypes?: readonly CommunicationParticipantType[];
  readonly roles?: readonly CommunicationParticipantRole[];
  readonly conversationTypes?: readonly CommunicationConversationType[];
  readonly channels?: readonly CommunicationChannelKind[];
  readonly requiresOwnership?: boolean;
}

export interface CommunicationPermissionDecision {
  readonly allowed: boolean;
  readonly action: CommunicationPermissionAction;
  readonly matchedRuleId?: CommunicationId;
  readonly reason: string;
}

export const defaultCommunicationPermissionRules =
  [
    {
      id: "communication-member-conversation-create",
      action: "conversation:create",
      effect: "allow",
      roles: ["owner", "member", "assistant", "agent"],
    },
    {
      id: "communication-owner-full-access",
      action: "conversation:update",
      effect: "allow",
      roles: ["owner"],
      requiresOwnership: true,
    },
    {
      id: "communication-owner-resolve",
      action: "conversation:resolve",
      effect: "allow",
      roles: ["owner"],
      requiresOwnership: true,
    },
    {
      id: "communication-owner-archive",
      action: "conversation:archive",
      effect: "allow",
      roles: ["owner"],
      requiresOwnership: true,
    },
    {
      id: "communication-member-read",
      action: "conversation:read",
      effect: "allow",
      roles: ["owner", "member", "observer", "assistant", "agent"],
    },
    {
      id: "communication-member-message-read",
      action: "message:read",
      effect: "allow",
      roles: ["owner", "member", "observer", "assistant", "agent"],
    },
    {
      id: "communication-member-message-create",
      action: "message:create",
      effect: "allow",
      roles: ["owner", "member", "assistant", "agent"],
    },
    {
      id: "communication-member-message-send",
      action: "message:send",
      effect: "allow",
      roles: ["owner", "member", "assistant", "agent"],
    },
    {
      id: "communication-observer-write-denied",
      action: "message:create",
      effect: "deny",
      roles: ["observer"],
    },
    {
      id: "communication-system-channel-configure",
      action: "channel:configure",
      effect: "allow",
      participantTypes: ["system"],
    },
    {
      id: "communication-system-audit-read",
      action: "audit:read",
      effect: "allow",
      participantTypes: ["system"],
    },
  ] as const satisfies readonly CommunicationPermissionRule[];

export function evaluateCommunicationPermission(
  action: CommunicationPermissionAction,
  context: CommunicationPermissionContext,
  rules: readonly CommunicationPermissionRule[] =
    defaultCommunicationPermissionRules,
  isResourceOwner = false,
): CommunicationPermissionDecision {
  const matchingRules = rules.filter((rule) => {
    if (rule.action !== action) {
      return false;
    }

    if (
      rule.participantTypes &&
      !rule.participantTypes.includes(
        context.subject.participantType,
      )
    ) {
      return false;
    }

    if (
      rule.roles &&
      !rule.roles.includes(context.subject.role)
    ) {
      return false;
    }

    if (
      rule.conversationTypes &&
      (!context.resource?.conversationType ||
        !rule.conversationTypes.includes(
          context.resource.conversationType,
        ))
    ) {
      return false;
    }

    if (
      rule.channels &&
      (!context.resource?.channel ||
        !rule.channels.includes(context.resource.channel))
    ) {
      return false;
    }

    if (rule.requiresOwnership && !isResourceOwner) {
      return false;
    }

    return true;
  });

  const deniedRule = matchingRules.find(
    (rule) => rule.effect === "deny",
  );

  if (deniedRule) {
    return {
      allowed: false,
      action,
      matchedRuleId: deniedRule.id,
      reason: "Communication permission explicitly denied.",
    };
  }

  const allowedRule = matchingRules.find(
    (rule) => rule.effect === "allow",
  );

  if (allowedRule) {
    return {
      allowed: true,
      action,
      matchedRuleId: allowedRule.id,
      reason: "Communication permission granted.",
    };
  }

  return {
    allowed: false,
    action,
    reason: "No communication permission rule granted access.",
  };
}

export function assertCommunicationPermission(
  action: CommunicationPermissionAction,
  context: CommunicationPermissionContext,
  rules?: readonly CommunicationPermissionRule[],
  isResourceOwner = false,
): void {
  const decision = evaluateCommunicationPermission(
    action,
    context,
    rules,
    isResourceOwner,
  );

  if (!decision.allowed) {
    throw new Error(
      `Communication permission denied for action "${action}". ${decision.reason}`,
    );
  }
}
