import {
  CustomerInteraction,
  CustomerRelationshipInteractionChannel,
} from "./customerRelationshipManagementTypes";

export function createCustomerInteraction(input: {
  id: string;
  accountId: string;
  profileId?: string;
  channel: CustomerRelationshipInteractionChannel;
  summary: string;
  sentimentScore?: number;
  occurredAt?: string;
  metadata?: Record<string, unknown>;
}): CustomerInteraction {
  return {
    id: input.id,
    accountId: input.accountId,
    profileId: input.profileId,
    channel: input.channel,
    summary: input.summary,
    sentimentScore: clampScore(input.sentimentScore ?? 0.5),
    occurredAt: input.occurredAt ?? new Date().toISOString(),
    metadata: input.metadata,
  };
}

export function isNegativeCustomerInteraction(
  interaction: CustomerInteraction,
): boolean {
  return interaction.sentimentScore < 0.4;
}

function clampScore(score: number): number {
  return Math.max(0, Math.min(score, 1));
}