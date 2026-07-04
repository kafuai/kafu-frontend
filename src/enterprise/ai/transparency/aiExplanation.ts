import { AITransparencyExplanationType } from "./aiTransparencyTypes";

export interface AIExplanation {
  id: string;
  transparencyRecordId: string;
  type: AITransparencyExplanationType;
  title: string;
  content: string;
  confidence?: number;
  visibleToEndUser: boolean;
  createdAt: Date;
}

export interface CreateAIExplanationInput {
  id: string;
  transparencyRecordId: string;
  type: AITransparencyExplanationType;
  title: string;
  content: string;
  confidence?: number;
  visibleToEndUser?: boolean;
}

export function createAIExplanation(
  input: CreateAIExplanationInput,
): AIExplanation {
  return {
    id: input.id,
    transparencyRecordId: input.transparencyRecordId,
    type: input.type,
    title: input.title,
    content: input.content,
    confidence: input.confidence,
    visibleToEndUser: input.visibleToEndUser ?? true,
    createdAt: new Date(),
  };
}