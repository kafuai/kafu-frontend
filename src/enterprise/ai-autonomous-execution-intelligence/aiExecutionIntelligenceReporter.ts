import { AIExecutionIntelligenceProfile } from "./aiExecutionIntelligenceProfile";
import { AIExecutionPatternSummary } from "./aiExecutionPatternAnalyzer";

export interface AIExecutionIntelligenceReport {
  profileId: string;
  executionId: string;
  overallScore: number;
  confidence: string;
  trend: string;
  totalInsights: number;
  strengths: string[];
  weaknesses: string[];
  patternSummaries: AIExecutionPatternSummary[];
  generatedAt: Date;
}

export function createAIExecutionIntelligenceReport(
  profile: AIExecutionIntelligenceProfile,
  patternSummaries: AIExecutionPatternSummary[],
): AIExecutionIntelligenceReport {
  return {
    profileId: profile.id,
    executionId: profile.executionId,
    overallScore: profile.overallScore,
    confidence: profile.confidence,
    trend: profile.trend,
    totalInsights: profile.insights.length,
    strengths: profile.strengths,
    weaknesses: profile.weaknesses,
    patternSummaries,
    generatedAt: new Date(),
  };
}