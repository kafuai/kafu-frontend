import {
  AITransparencyAudience,
  AITransparencyDisclosureLevel,
} from "./aiTransparencyTypes";

export interface AITransparencyDisclosure {
  id: string;
  transparencyRecordId: string;
  audience: AITransparencyAudience;
  disclosureLevel: AITransparencyDisclosureLevel;
  message: string;
  includesAIUsageNotice: boolean;
  includesLimitations: boolean;
  includesHumanReviewNotice: boolean;
  includesAppealOrContactPath: boolean;
  createdAt: Date;
}

export interface CreateAITransparencyDisclosureInput {
  id: string;
  transparencyRecordId: string;
  audience: AITransparencyAudience;
  disclosureLevel: AITransparencyDisclosureLevel;
  message: string;
  includesAIUsageNotice?: boolean;
  includesLimitations?: boolean;
  includesHumanReviewNotice?: boolean;
  includesAppealOrContactPath?: boolean;
}

export function createAITransparencyDisclosure(
  input: CreateAITransparencyDisclosureInput,
): AITransparencyDisclosure {
  return {
    id: input.id,
    transparencyRecordId: input.transparencyRecordId,
    audience: input.audience,
    disclosureLevel: input.disclosureLevel,
    message: input.message,
    includesAIUsageNotice: input.includesAIUsageNotice ?? true,
    includesLimitations: input.includesLimitations ?? false,
    includesHumanReviewNotice: input.includesHumanReviewNotice ?? false,
    includesAppealOrContactPath: input.includesAppealOrContactPath ?? false,
    createdAt: new Date(),
  };
}