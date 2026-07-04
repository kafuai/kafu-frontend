import { AIDataSourceDisclosure } from "./aiDataSourceDisclosure";
import { AIExplanation } from "./aiExplanation";
import { AIHumanReviewDisclosure } from "./aiHumanReviewDisclosure";
import { AITransparencyRecord } from "./aiTransparencyRecord";

export interface AITransparencySummary {
  transparencyRecordId: string;
  title: string;
  purpose: string;
  summary: string;
  isAIGenerated: boolean;
  disclosureLevel: string;
  explanations: string[];
  dataSources: string[];
  limitations: string[];
  humanReviewStatus?: string;
  generatedAt: Date;
}

export interface BuildAITransparencySummaryInput {
  record: AITransparencyRecord;
  explanations?: AIExplanation[];
  dataSources?: AIDataSourceDisclosure[];
  humanReview?: AIHumanReviewDisclosure;
}

export function buildAITransparencySummary(
  input: BuildAITransparencySummaryInput,
): AITransparencySummary {
  return {
    transparencyRecordId: input.record.id,
    title: input.record.title,
    purpose: input.record.purpose,
    summary: input.record.summary,
    isAIGenerated: input.record.isAIGenerated,
    disclosureLevel: input.record.disclosureLevel,
    explanations: (input.explanations ?? [])
      .filter(explanation => explanation.visibleToEndUser)
      .map(explanation => explanation.content),
    dataSources: (input.dataSources ?? []).map(
      source => source.sourceName,
    ),
    limitations: input.record.limitations,
    humanReviewStatus: input.humanReview?.status,
    generatedAt: new Date(),
  };
}