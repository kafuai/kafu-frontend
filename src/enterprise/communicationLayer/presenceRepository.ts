import type {
  CommunicationPresence,
} from "./presenceModels";

export interface CommunicationPresenceQuery {
  readonly companyId: string;
  readonly tenantId: string;
  readonly organizationId: string;
  readonly participantId?: string;
  readonly conversationId?: string;
}

export interface CommunicationPresenceRepository {
  upsert(
    presence: CommunicationPresence,
  ): Promise<CommunicationPresence>;

  findParticipantPresence(
    companyId: string,
    participantId: string,
  ): Promise<CommunicationPresence | null>;

  list(
    query: CommunicationPresenceQuery,
  ): Promise<readonly CommunicationPresence[]>;

  remove(
    companyId: string,
    participantId: string,
    connectionId?: string,
  ): Promise<void>;

  removeExpired(
    companyId: string,
    expiresBefore: string,
  ): Promise<number>;
}
