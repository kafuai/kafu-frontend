import type {
  CommunicationAttributes,
  CommunicationId,
} from "./communicationTypes";

export type CommunicationChannelKind =
  | "platform"
  | "internal_chat"
  | "web"
  | "mobile"
  | "desktop"
  | "email"
  | "whatsapp"
  | "voice"
  | "sms"
  | "push"
  | "in_app"
  | "slack"
  | "teams"
  | "api"
  | "webhook"
  | "system";

export type CommunicationChannelCategory =
  | "internal"
  | "external"
  | "notification"
  | "integration"
  | "system";

export type CommunicationChannelCapability =
  | "text"
  | "rich_text"
  | "attachments"
  | "voice"
  | "video"
  | "reactions"
  | "typing"
  | "presence"
  | "delivery_receipts"
  | "read_receipts"
  | "threading"
  | "templates"
  | "webhooks";

export type CommunicationChannelStatus =
  | "active"
  | "inactive"
  | "degraded"
  | "disabled";

export interface CommunicationChannelDefinition {
  readonly id: CommunicationId;
  readonly kind: CommunicationChannelKind;
  readonly category: CommunicationChannelCategory;
  readonly displayName: string;
  readonly status: CommunicationChannelStatus;
  readonly capabilities: readonly CommunicationChannelCapability[];
  readonly supportsInbound: boolean;
  readonly supportsOutbound: boolean;
  readonly supportsRealtime: boolean;
  readonly requiresExternalProvider: boolean;
  readonly provider?: string;
  readonly attributes?: CommunicationAttributes;
}

export const communicationChannelDefinitions = {
  platform: {
    id: "platform",
    kind: "platform",
    category: "internal",
    displayName: "KAFU AI Platform",
    status: "active",
    capabilities: [
      "text",
      "rich_text",
      "attachments",
      "voice",
      "reactions",
      "typing",
      "presence",
      "delivery_receipts",
      "read_receipts",
      "threading",
    ],
    supportsInbound: true,
    supportsOutbound: true,
    supportsRealtime: true,
    requiresExternalProvider: false,
  },
  internal_chat: {
    id: "internal_chat",
    kind: "internal_chat",
    category: "internal",
    displayName: "Internal Chat",
    status: "active",
    capabilities: [
      "text",
      "attachments",
      "voice",
      "reactions",
      "typing",
      "presence",
      "delivery_receipts",
      "read_receipts",
      "threading",
    ],
    supportsInbound: true,
    supportsOutbound: true,
    supportsRealtime: true,
    requiresExternalProvider: false,
  },
  email: {
    id: "email",
    kind: "email",
    category: "external",
    displayName: "Email",
    status: "active",
    capabilities: [
      "text",
      "rich_text",
      "attachments",
      "delivery_receipts",
      "templates",
    ],
    supportsInbound: true,
    supportsOutbound: true,
    supportsRealtime: false,
    requiresExternalProvider: true,
  },
  whatsapp: {
    id: "whatsapp",
    kind: "whatsapp",
    category: "external",
    displayName: "WhatsApp",
    status: "active",
    capabilities: [
      "text",
      "attachments",
      "voice",
      "delivery_receipts",
      "read_receipts",
      "templates",
      "webhooks",
    ],
    supportsInbound: true,
    supportsOutbound: true,
    supportsRealtime: true,
    requiresExternalProvider: true,
  },
  voice: {
    id: "voice",
    kind: "voice",
    category: "external",
    displayName: "Voice",
    status: "active",
    capabilities: [
      "voice",
      "attachments",
      "delivery_receipts",
    ],
    supportsInbound: true,
    supportsOutbound: true,
    supportsRealtime: false,
    requiresExternalProvider: false,
  },
  api: {
    id: "api",
    kind: "api",
    category: "integration",
    displayName: "API",
    status: "active",
    capabilities: [
      "text",
      "attachments",
      "delivery_receipts",
      "webhooks",
    ],
    supportsInbound: true,
    supportsOutbound: true,
    supportsRealtime: false,
    requiresExternalProvider: false,
  },
  system: {
    id: "system",
    kind: "system",
    category: "system",
    displayName: "System",
    status: "active",
    capabilities: ["text", "delivery_receipts"],
    supportsInbound: false,
    supportsOutbound: true,
    supportsRealtime: true,
    requiresExternalProvider: false,
  },
} as const satisfies Readonly<
  Record<string, CommunicationChannelDefinition>
>;

export function getCommunicationChannelDefinition(
  kind: CommunicationChannelKind,
): CommunicationChannelDefinition | undefined {
  return Object.values(communicationChannelDefinitions).find(
    (definition) => definition.kind === kind,
  );
}

export function supportsCommunicationCapability(
  kind: CommunicationChannelKind,
  capability: CommunicationChannelCapability,
): boolean {
  return (
    getCommunicationChannelDefinition(kind)?.capabilities.includes(
      capability,
    ) ?? false
  );
}
