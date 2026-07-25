import {
  createCommunicationPresence,
  type CommunicationPresence,
  type UpdateCommunicationPresenceInput,
} from "./presenceModels";

import type {
  CommunicationPresenceQuery,
  CommunicationPresenceRepository,
} from "./presenceRepository";

export interface CommunicationPresenceRuntime {
  update(
    input: UpdateCommunicationPresenceInput,
  ): Promise<CommunicationPresence>;

  markOffline(
    companyId: string,
    participantId: string,
    connectionId?: string,
  ): Promise<void>;

  getParticipant(
    companyId: string,
    participantId: string,
  ): Promise<CommunicationPresence | null>;

  list(
    query: CommunicationPresenceQuery,
  ): Promise<readonly CommunicationPresence[]>;

  clearExpired(
    companyId: string,
    expiresBefore?: string,
  ): Promise<number>;
}

export class DefaultCommunicationPresenceRuntime
  implements CommunicationPresenceRuntime
{
  constructor(
    private readonly repository:
      CommunicationPresenceRepository,
  ) {}

  async update(
    input: UpdateCommunicationPresenceInput,
  ): Promise<CommunicationPresence> {
    const presence =
      createCommunicationPresence(input);

    return this.repository.upsert(presence);
  }

  async markOffline(
    companyId: string,
    participantId: string,
    connectionId?: string,
  ): Promise<void> {
    await this.repository.remove(
      companyId,
      participantId,
      connectionId,
    );
  }

  async getParticipant(
    companyId: string,
    participantId: string,
  ): Promise<CommunicationPresence | null> {
    return this.repository.findParticipantPresence(
      companyId,
      participantId,
    );
  }

  async list(
    query: CommunicationPresenceQuery,
  ): Promise<readonly CommunicationPresence[]> {
    return this.repository.list(query);
  }

  async clearExpired(
    companyId: string,
    expiresBefore = new Date().toISOString(),
  ): Promise<number> {
    return this.repository.removeExpired(
      companyId,
      expiresBefore,
    );
  }
}

export function createCommunicationPresenceRuntime(
  repository: CommunicationPresenceRepository,
): CommunicationPresenceRuntime {
  return new DefaultCommunicationPresenceRuntime(
    repository,
  );
}
