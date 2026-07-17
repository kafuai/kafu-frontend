import { RankedStrategicDecision } from "./strategicDecisionRankingEngine";
import {
  StrategicDecisionRiskAssessment,
} from "./strategicDecisionRiskAssessor";
import {
  StrategicDecisionScore,
} from "./strategicDecisionScoreCalculator";

export interface StrategicDecisionRecommendation {
  title: string;
  summary: string;
  rationale: string;
  recommendedActions: string[];
}

export interface StrategicDecisionResult {
  generatedAt: string;
  organizationId: string;
  rankedDecision: RankedStrategicDecision;
  score: StrategicDecisionScore;
  riskAssessment: StrategicDecisionRiskAssessment;
  recommendation: StrategicDecisionRecommendation;
}
