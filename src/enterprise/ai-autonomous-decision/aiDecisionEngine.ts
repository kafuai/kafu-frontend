import { AIDecisionContext } from "./aiDecisionContext";
import { AIDecisionCriterion } from "./aiDecisionCriteria";
import { AIDecisionOption } from "./aiDecisionOption";
import {
  AIDecisionEvaluationResult,
  evaluateAIDecisionOptions,
} from "./aiDecisionEvaluator";
import {
  AIDecisionConfidenceAssessment,
  assessAIDecisionConfidence,
} from "./aiDecisionConfidence";
import {
  AIDecisionRiskAssessment,
  assessAIDecisionRisk,
} from "./aiDecisionRiskAssessment";
import {
  AIDecisionPolicy,
  createAIDecisionPolicy,
} from "./aiDecisionPolicy";
import {
  AIDecisionSelection,
  selectAIDecisionOption,
} from "./aiDecisionSelection";
import {
  AIDecisionOutcomeResolution,
  resolveAIDecisionOutcome,
} from "./aiDecisionOutcome";
import {
  AIDecisionRecommendation,
  createAIDecisionRecommendation,
} from "./aiDecisionRecommendation";
import {
  AIDecisionAuditRecord,
  createAIDecisionAuditRecord,
} from "./aiDecisionAudit";
import {
  AIDecisionImpactAnalysis,
  analyzeAIDecisionImpact,
} from "./aiDecisionImpactAnalysis";
import {
  AIDecisionExplanation,
  explainAIDecision,
} from "./aiDecisionExplanation";
import {
  AIDecisionGovernanceAssessment,
  assessAIDecisionGovernance,
} from "./aiDecisionGovernance";
import {
  AIDecisionTrace,
  createAIDecisionTrace,
} from "./aiDecisionTrace";
import {
  AIDecisionReview,
  createAIDecisionReview,
} from "./aiDecisionReview";

export interface RunAIDecisionEngineInput {
  context: AIDecisionContext;
  options: AIDecisionOption[];
  criteria: AIDecisionCriterion[];
  policy?: AIDecisionPolicy;
  createdBy: string;
}

export interface AIDecisionEngineResult {
  context: AIDecisionContext;
  evaluation: AIDecisionEvaluationResult;
  confidenceAssessments: AIDecisionConfidenceAssessment[];
  riskAssessments: AIDecisionRiskAssessment[];
  selection: AIDecisionSelection;
  outcome: AIDecisionOutcomeResolution;
  impact?: AIDecisionImpactAnalysis;
  explanation: AIDecisionExplanation;
  governance: AIDecisionGovernanceAssessment;
  trace: AIDecisionTrace;
  review: AIDecisionReview;
  recommendation: AIDecisionRecommendation;
  auditRecord: AIDecisionAuditRecord;
  completedAt: Date;
}

export function runAIDecisionEngine(
  input: RunAIDecisionEngineInput,
): AIDecisionEngineResult {
  const policy =
    input.policy ??
    createAIDecisionPolicy({
      id: `${input.context.id}-policy`,
      name: "Default Autonomous Decision Policy",
      description: "Default policy for autonomous enterprise decision evaluation.",
    });

  const evaluation = evaluateAIDecisionOptions(input.options, input.criteria);

  const confidenceAssessments = evaluation.scorecards.map((scorecard) =>
    assessAIDecisionConfidence(scorecard),
  );

  const riskAssessments = evaluation.evaluatedOptions.map((option) => {
    const scorecard = evaluation.scorecards.find((item) => item.optionId === option.id);

    if (!scorecard) {
      throw new Error(`Missing scorecard for decision option: ${option.id}`);
    }

    return assessAIDecisionRisk(option, scorecard);
  });

  const selection = selectAIDecisionOption({
    options: evaluation.evaluatedOptions,
    scorecards: evaluation.scorecards,
    confidenceAssessments,
    riskAssessments,
    minimumScore: policy.minimumScore,
    minimumConfidence: policy.minimumConfidence,
    allowHighRisk: (policy.allowedRiskLevels ?? ["low", "medium", "high"]).includes("high"),
  });

  const selectedConfidence = confidenceAssessments.find(
    (item) => item.optionId === selection.selectedOption?.id,
  );

  const selectedRisk = riskAssessments.find(
    (item) => item.optionId === selection.selectedOption?.id,
  );

  const selectedScorecard = evaluation.scorecards.find(
    (item) => item.optionId === selection.selectedOption?.id,
  );

  const outcome = resolveAIDecisionOutcome(
    selection.selectedOption,
    policy,
    selectedConfidence,
    selectedRisk,
  );

  const impact =
    selection.selectedOption && selectedRisk && selectedScorecard
      ? analyzeAIDecisionImpact(selection.selectedOption, selectedScorecard, selectedRisk)
      : undefined;

  const explanation = explainAIDecision({
    decisionId: input.context.id,
    selection,
    outcome,
    confidence: selectedConfidence,
    risk: selectedRisk,
    impact,
  });

  const governance = assessAIDecisionGovernance({
    decisionId: input.context.id,
    outcome,
    risk: selectedRisk,
    impact,
  });

  const trace = createAIDecisionTrace({
    decisionId: input.context.id,
    steps: [
      {
        id: "evaluation",
        label: "Evaluation",
        description: "Decision options evaluated.",
      },
      {
        id: "selection",
        label: "Selection",
        description: "Best option selected.",
      },
      {
        id: "governance",
        label: "Governance",
        description: "Governance assessment completed.",
      },
      {
        id: "audit",
        label: "Audit",
        description: "Audit record created.",
      },
    ],
  });

  const review = createAIDecisionReview(governance);

  const recommendation = createAIDecisionRecommendation({
    id: `${input.context.id}-recommendation`,
    selection,
    outcome,
  });

  const auditRecord = createAIDecisionAuditRecord({
    id: `${input.context.id}-audit`,
    context: input.context,
    selection,
    outcome,
    createdBy: input.createdBy,
  });

  return {
    context: input.context,
    evaluation,
    confidenceAssessments,
    riskAssessments,
    selection,
    outcome,
    impact,
    explanation,
    governance,
    trace,
    review,
    recommendation,
    auditRecord,
    completedAt: new Date(),
  };
}