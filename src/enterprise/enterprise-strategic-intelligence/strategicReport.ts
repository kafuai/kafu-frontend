import {
  StrategicInsight,
  StrategicRecommendation,
  StrategicReport,
} from "./strategicIntelligenceTypes";
import { StrategicRiskAssessment } from "./strategicRisk";
import { StrategicRoadmapItem } from "./strategicRoadmap";

export interface EnterpriseStrategicIntelligenceReport extends StrategicReport {
  roadmap: StrategicRoadmapItem[];
  risks: StrategicRiskAssessment[];
  executiveSummary: string;
}

export function createStrategicReport(
  organizationId: string,
  insights: StrategicInsight[],
  recommendations: StrategicRecommendation[],
  roadmap: StrategicRoadmapItem[],
  risks: StrategicRiskAssessment[],
): EnterpriseStrategicIntelligenceReport {
  return {
    organizationId,
    insights,
    recommendations,
    roadmap,
    risks,
    executiveSummary: buildExecutiveSummary(
      insights.length,
      recommendations.length,
      risks.length,
    ),
    generatedAt: new Date(),
  };
}

function buildExecutiveSummary(
  insightCount: number,
  recommendationCount: number,
  riskCount: number,
): string {
  return `Strategic intelligence generated from ${insightCount} insights, ${recommendationCount} recommendations, and ${riskCount} risk assessments.`;
}