import { analyzeCompetitiveSignals } from "./competitiveAnalysis";
import { analyzeIndustrySignals } from "./industryAnalysis";
import { analyzeMarketSignals } from "./marketAnalysis";
import { createScenarioAnalysis } from "./scenarioAnalysis";
import { createStrategicDashboardSummary } from "./strategicDashboard";
import { createStrategicObjectives } from "./strategicObjective";
import { createStrategicOptionsFromScenarios } from "./strategicOption";
import { identifyStrategicOpportunities } from "./strategicOpportunity";
import { prioritizeStrategicOptions } from "./strategicPrioritization";
import { createStrategicRecommendationsFromOptions } from "./strategicRecommendation";
import { createStrategicReport } from "./strategicReport";
import { assessStrategicRisks } from "./strategicRisk";
import { scoreStrategicOptions } from "./strategicScoring";
import { StrategicSignal } from "./strategicIntelligenceTypes";
import { createStrategicRoadmap } from "./strategicRoadmap";

export interface StrategicEngineInput {
  organizationId: string;
  signals: StrategicSignal[];
}

export function runStrategicIntelligenceEngine(input: StrategicEngineInput) {
  const marketInsights = analyzeMarketSignals(input.signals);
  const industryInsights = analyzeIndustrySignals(input.signals);
  const competitiveInsights = analyzeCompetitiveSignals(input.signals);

  const insights = [
    ...marketInsights,
    ...industryInsights,
    ...competitiveInsights,
  ];

  const opportunityRecommendations = identifyStrategicOpportunities(
    input.signals,
  );

  const scenario = createScenarioAnalysis(
    "default-strategic-scenario",
    "Default Strategic Scenario",
    insights,
    opportunityRecommendations,
  );

  const options = prioritizeStrategicOptions(
    scoreStrategicOptions(createStrategicOptionsFromScenarios([scenario])),
  );

  const objectives = createStrategicObjectives(options);
  const roadmap = createStrategicRoadmap(objectives);

  const recommendations =
    createStrategicRecommendationsFromOptions(options);

  const risks = assessStrategicRisks(recommendations);

  const report = createStrategicReport(
    input.organizationId,
    insights,
    recommendations,
    roadmap,
    risks,
  );

  const dashboard = createStrategicDashboardSummary(report);

  return {
    report,
    dashboard,
  };
}