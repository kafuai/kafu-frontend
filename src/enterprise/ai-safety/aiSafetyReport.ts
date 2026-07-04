import { AISafetyDecision } from "./aiSafetyTypes";
import { AISafetyIncident } from "./aiSafetyIncident";
import { AISafetyRecommendation } from "./aiSafetyRecommendation";

export interface AISafetyReport {
  id: string;
  organizationId: string;
  requestId: string;
  modelId: string;
  decision: AISafetyDecision;
  incident: AISafetyIncident | null;
  recommendations: AISafetyRecommendation[];
  generatedAt: Date;
}

export function generateAISafetyReport(input: {
  organizationId: string;
  requestId: string;
  modelId: string;
  decision: AISafetyDecision;
  incident: AISafetyIncident | null;
  recommendations: AISafetyRecommendation[];
}): AISafetyReport {
  return {
    id: `${input.requestId}-ai-safety-report`,
    organizationId: input.organizationId,
    requestId: input.requestId,
    modelId: input.modelId,
    decision: input.decision,
    incident: input.incident,
    recommendations: input.recommendations,
    generatedAt: new Date(),
  };
}