import {
  StrategicInsight,
  StrategicRecommendation,
} from "./strategicIntelligenceTypes";

export interface StrategicScenarioAnalysis {
  id: string;
  title: string;
  probability: number;
  impact: number;
  insights: StrategicInsight[];
  recommendations: StrategicRecommendation[];
}

export function createScenarioAnalysis(
  id: string,
  title: string,
  insights: StrategicInsight[],
  recommendations: StrategicRecommendation[],
): StrategicScenarioAnalysis {
  const confidenceAverage =
    insights.length === 0
      ? 0
      : insights.reduce((total, insight) => total + insight.confidence, 0) /
        insights.length;

  const impactAverage =
    recommendations.length === 0
      ? 0
      : recommendations.reduce(
          (total, recommendation) => total + recommendation.expectedImpact,
          0,
        ) / recommendations.length;

  return {
    id,
    title,
    probability: Math.round(confidenceAverage * 100) / 100,
    impact: Math.round(impactAverage * 100) / 100,
    insights,
    recommendations,
  };
}