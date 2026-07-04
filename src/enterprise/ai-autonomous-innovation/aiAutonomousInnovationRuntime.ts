import {
  AIInnovationPipelineConfig,
  AIInnovationPipelineResult,
  runAIInnovationPipeline,
} from "./aiInnovationPipeline";
import {
  AIInnovationGovernanceDecision,
  AIInnovationGovernancePolicy,
  evaluateAIInnovationGovernance,
} from "./aiInnovationGovernance";
import { AIInnovationOpportunity } from "./aiInnovationOpportunity";
import { AIInnovationSignal } from "./aiInnovationSignal";
import { createAIInnovationPortfolio, AIInnovationPortfolio } from "./aiInnovationPortfolio";
import { createAIInnovationReportSummary, AIInnovationReportSummary } from "./aiInnovationReporter";
import { generateAIInnovationInsight, AIInnovationInsight } from "./aiInnovationInsight";
import { assessAIInnovationReadiness, AIInnovationReadinessAssessment } from "./aiInnovationReadiness";
import { buildAIInnovationRoadmap, AIInnovationRoadmap } from "./aiInnovationRoadmap";

export interface AIAutonomousInnovationRuntimeInput {
  organizationId: string;
  signals: AIInnovationSignal[];
  pipelineConfig: AIInnovationPipelineConfig;
  governancePolicy: AIInnovationGovernancePolicy;
}

export interface AIAutonomousInnovationRuntimeResult {
  pipeline: AIInnovationPipelineResult;
  approvedOpportunities: AIInnovationOpportunity[];
  governanceDecisions: AIInnovationGovernanceDecision[];
  portfolio: AIInnovationPortfolio;
  report: AIInnovationReportSummary;
  insights: AIInnovationInsight[];
  readinessAssessments: AIInnovationReadinessAssessment[];
  roadmaps: AIInnovationRoadmap[];
  executedAt: Date;
}

export function runAIAutonomousInnovationRuntime(
  input: AIAutonomousInnovationRuntimeInput,
): AIAutonomousInnovationRuntimeResult {
  const pipeline = runAIInnovationPipeline(
    input.organizationId,
    input.signals,
    input.pipelineConfig,
  );

  const governanceDecisions = pipeline.opportunities.map((opportunity) =>
    evaluateAIInnovationGovernance(opportunity, input.governancePolicy),
  );

  const approvedOpportunities = pipeline.opportunities.filter((opportunity) =>
    governanceDecisions.some(
      (decision) =>
        decision.opportunityId === opportunity.id && decision.decision === "approved",
    ),
  );

  const portfolio = createAIInnovationPortfolio(
    input.organizationId,
    approvedOpportunities,
  );

  return {
    pipeline,
    approvedOpportunities,
    governanceDecisions,
    portfolio,
    report: createAIInnovationReportSummary(portfolio),
    insights: approvedOpportunities.map(generateAIInnovationInsight),
    readinessAssessments: approvedOpportunities.map(assessAIInnovationReadiness),
    roadmaps: approvedOpportunities.map(buildAIInnovationRoadmap),
    executedAt: new Date(),
  };
}