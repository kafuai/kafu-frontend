import { AIAccountabilityEvidenceType } from "./aiAccountabilityTypes";

export interface AIAccountabilityEvidence {
  id: string;
  organizationId: string;
  decisionId: string;
  type: AIAccountabilityEvidenceType;
  title: string;
  description: string;
  source: string;
  uri?: string;
  hash?: string;
  capturedBy: string;
  capturedAt: Date;
  retentionUntil?: Date;
  metadata: Record<string, string | number | boolean>;
}

export interface CreateAIAccountabilityEvidenceInput {
  id: string;
  organizationId: string;
  decisionId: string;
  type: AIAccountabilityEvidenceType;
  title: string;
  description: string;
  source: string;
  uri?: string;
  hash?: string;
  capturedBy: string;
  retentionUntil?: Date;
  metadata?: Record<string, string | number | boolean>;
}

export function createAIAccountabilityEvidence(
  input: CreateAIAccountabilityEvidenceInput,
  now: Date = new Date(),
): AIAccountabilityEvidence {
  return {
    id: input.id,
    organizationId: input.organizationId,
    decisionId: input.decisionId,
    type: input.type,
    title: input.title,
    description: input.description,
    source: input.source,
    uri: input.uri,
    hash: input.hash,
    capturedBy: input.capturedBy,
    capturedAt: now,
    retentionUntil: input.retentionUntil,
    metadata: input.metadata ?? {},
  };
}

export function hasTamperEvidenceSignal(
  evidence: AIAccountabilityEvidence,
): boolean {
  return evidence.hash === undefined || evidence.hash.trim().length === 0;
}

export function isEvidenceRetained(
  evidence: AIAccountabilityEvidence,
  at: Date = new Date(),
): boolean {
  return (
    evidence.retentionUntil === undefined ||
    evidence.retentionUntil.getTime() >= at.getTime()
  );
}