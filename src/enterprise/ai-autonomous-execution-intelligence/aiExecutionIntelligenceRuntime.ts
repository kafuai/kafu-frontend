import {
  AIExecutionIntelligenceProfile,
  createAIExecutionIntelligenceProfile,
} from "./aiExecutionIntelligenceProfile";
import { AIExecutionInsight } from "./aiExecutionInsight";
import {
  analyzeAIExecutionPatterns,
  AIExecutionPatternSummary,
} from "./aiExecutionPatternAnalyzer";
import {
  evaluateAIExecutionSignals,
  AIExecutionSignalEvaluation,
} from "./aiExecutionSignalEvaluator";
import {
  scoreAIExecutionIntelligence,
  AIExecutionIntelligenceScore,
} from "./aiExecutionIntelligenceScoring";
import {
  createAIExecutionIntelligenceReport,
  AIExecutionIntelligenceReport,
} from "./aiExecutionIntelligenceReporter";
import { AIExecutionIntelligenceMetadata } from "./aiExecutionIntelligenceTypes";

export interface AIExecutionIntelligenceRuntimeInput {
  profileId: string;
  executionId: string;
  insights: AIExecutionInsight[];
  minimumConfidence: number;
  metadata: AIExecutionIntelligenceMetadata;
  strengths?: string[];
  weaknesses?: string[];
}

export interface AIExecutionIntelligenceRuntimeResult {
  profile: AIExecutionIntelligenceProfile;
  score: AIExecutionIntelligenceScore;
  signalEvaluation: AIExecutionSignalEvaluation;
  patternSummaries: AIExecutionPatternSummary[];
  report: AIExecutionIntelligenceReport;
}

export function runAIExecutionIntelligenceRuntime(
  input: AIExecutionIntelligenceRuntimeInput,
): AIExecutionIntelligenceRuntimeResult {
  const signalEvaluation = evaluateAIExecutionSignals(input.insights, {
    minimumConfidence: input.minimumConfidence,
  });

  const score = scoreAIExecutionIntelligence(signalEvaluation.accepted);

  const patternSummaries = analyzeAIExecutionPatterns(signalEvaluation.accepted);

  const profile = createAIExecutionIntelligenceProfile({
    id: input.profileId,
    executionId: input.executionId,
    overallScore: score.score,
    insights: signalEvaluation.accepted,
    strengths: input.strengths,
    weaknesses: input.weaknesses,
    metadata: input.metadata,
  });

  const report = createAIExecutionIntelligenceReport(profile, patternSummaries);

  return {
    profile,
    score,
    signalEvaluation,
    patternSummaries,
    report,
  };
}