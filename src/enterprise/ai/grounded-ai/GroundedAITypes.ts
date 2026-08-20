import type {
  AIProviderId,
} from "../provider-gateway";

export type GroundedAIEvidenceValue =
  | string
  | number
  | boolean
  | null
  | readonly string[]
  | Readonly<Record<string, unknown>>;

export interface GroundedAIEvidence {
  id: string;
  source: string;
  label: string;
  value: GroundedAIEvidenceValue;

  description?: string;
  confidence?: number;
  observedAt?: string;

  metadata?:
    Readonly<Record<string, unknown>>;
}

export interface GroundedAIContext {
  tenantId: string;
  workspaceId?: string;
  companyId?: string;
  userId?: string;

  locale?: string;

  metadata?:
    Readonly<Record<string, unknown>>;
}

export interface GroundedAIRequest {
  task: string;

  question?: string;

  evidence:
    readonly GroundedAIEvidence[];

  context:
    GroundedAIContext;

  provider?: AIProviderId;
  model?: string;

  correlationId?: string;

  instructions?: string;
}

export interface GroundedAICitation {
  evidenceId: string;
  source: string;
  label: string;
}

export interface GroundedAIResult {
  provider: AIProviderId;
  model: string;

  text: string;

  citations:
    readonly GroundedAICitation[];

  evidenceCount: number;

  responseId?: string;
  correlationId?: string;

  generatedAt: string;

  usage?: {
    inputTokens?: number;
    outputTokens?: number;
    totalTokens?: number;
  };
}
