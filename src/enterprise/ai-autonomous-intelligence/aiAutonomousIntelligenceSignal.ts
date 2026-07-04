import {
  AIAutonomousIntelligenceEvidence,
  AIAutonomousIntelligenceSignalSeverity,
  AIAutonomousIntelligenceSignalType,
  AIAutonomousIntelligenceSourceRef,
} from "./aiAutonomousIntelligenceTypes";

export interface AIAutonomousIntelligenceSignal {
  id: string;
  organizationId: string;
  type: AIAutonomousIntelligenceSignalType;
  severity: AIAutonomousIntelligenceSignalSeverity;
  title: string;
  description: string;
  source: AIAutonomousIntelligenceSourceRef;
  evidence: AIAutonomousIntelligenceEvidence[];
  detectedAt: Date;
  expiresAt?: Date;
}

export interface CreateAIAutonomousIntelligenceSignalInput {
  id: string;
  organizationId: string;
  type: AIAutonomousIntelligenceSignalType;
  severity: AIAutonomousIntelligenceSignalSeverity;
  title: string;
  description: string;
  source: AIAutonomousIntelligenceSourceRef;
  evidence?: AIAutonomousIntelligenceEvidence[];
  detectedAt?: Date;
  expiresAt?: Date;
}

export function createAIAutonomousIntelligenceSignal(
  input: CreateAIAutonomousIntelligenceSignalInput,
): AIAutonomousIntelligenceSignal {
  return {
    id: input.id,
    organizationId: input.organizationId,
    type: input.type,
    severity: input.severity,
    title: input.title,
    description: input.description,
    source: input.source,
    evidence: input.evidence ?? [],
    detectedAt: input.detectedAt ?? new Date(),
    expiresAt: input.expiresAt,
  };
}

export function isAIAutonomousIntelligenceSignalExpired(
  signal: AIAutonomousIntelligenceSignal,
  now: Date = new Date(),
): boolean {
  return Boolean(signal.expiresAt && signal.expiresAt.getTime() <= now.getTime());
}

export function filterActiveAIAutonomousIntelligenceSignals(
  signals: AIAutonomousIntelligenceSignal[],
  now: Date = new Date(),
): AIAutonomousIntelligenceSignal[] {
  return signals.filter(
    (signal) => !isAIAutonomousIntelligenceSignalExpired(signal, now),
  );
}