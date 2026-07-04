export type AITransparencyEvidenceType =
  | "disclosure"
  | "explanation"
  | "data_source"
  | "human_review"
  | "visibility_policy"
  | "summary";

export interface AITransparencyEvidence {
  id: string;
  transparencyRecordId: string;
  type: AITransparencyEvidenceType;
  title: string;
  description: string;
  referenceId?: string;
  capturedBy: string;
  capturedAt: Date;
}

export interface CreateAITransparencyEvidenceInput {
  id: string;
  transparencyRecordId: string;
  type: AITransparencyEvidenceType;
  title: string;
  description: string;
  referenceId?: string;
  capturedBy: string;
}

export function createAITransparencyEvidence(
  input: CreateAITransparencyEvidenceInput,
): AITransparencyEvidence {
  return {
    id: input.id,
    transparencyRecordId: input.transparencyRecordId,
    type: input.type,
    title: input.title,
    description: input.description,
    referenceId: input.referenceId,
    capturedBy: input.capturedBy,
    capturedAt: new Date(),
  };
}