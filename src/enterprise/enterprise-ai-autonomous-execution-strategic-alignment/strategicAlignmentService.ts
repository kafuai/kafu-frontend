import {
  createStrategicAlignmentContext,
  CreateStrategicAlignmentContextInput,
  StrategicAlignmentContext,
} from "./strategicAlignmentContext";
import {
  assessStrategicAlignment,
  StrategicAlignmentAssessment,
} from "./strategicAlignmentAssessmentEngine";
import {
  buildStrategicAlignmentRecommendation,
  StrategicAlignmentRecommendation,
} from "./strategicAlignmentRecommendationEngine";
import {
  buildStrategicAlignmentNarrative,
  StrategicAlignmentNarrative,
} from "./strategicAlignmentNarrativeBuilder";
import {
  createStrategicAlignmentResult,
  StrategicAlignmentResult,
} from "./strategicAlignmentResult";

export interface StrategicAlignmentServiceOutput {
  context: StrategicAlignmentContext;
  assessment: StrategicAlignmentAssessment;
  recommendation: StrategicAlignmentRecommendation;
  narrative: StrategicAlignmentNarrative;
  result: StrategicAlignmentResult;
}

export function evaluateEnterpriseStrategicAlignment(
  input: CreateStrategicAlignmentContextInput,
): StrategicAlignmentServiceOutput {
  const context = createStrategicAlignmentContext(input);

  const assessment = assessStrategicAlignment(context);

  const recommendation =
    buildStrategicAlignmentRecommendation(
      context,
      assessment,
    );

  const narrative = buildStrategicAlignmentNarrative(
    context,
    assessment,
    recommendation,
  );

  const result = createStrategicAlignmentResult({
    organizationId: context.organizationId,
    decisionId: context.decisionId,

    alignmentScore:
      assessment.scoreCalculation.alignmentScore,
    status: assessment.status,
    attentionLevel: assessment.attentionLevel,

    dimensionScores:
      assessment.scoreCalculation.dimensionScores,

    alignedObjectiveIds: context.strategicObjectiveIds,
    alignedPriorityIds: context.enterprisePriorityIds,
    alignedPortfolioIds: context.portfolioIds,
    alignedInitiativeIds: context.initiativeIds,

    conflicts: assessment.conflicts,
    blockingConstraints: assessment.blockingConstraints,

    executiveSummary: narrative.summary,
    recommendedAction: narrative.executionGuidance,

    evaluatedAt: context.evaluatedAt,
  });

  return {
    context,
    assessment,
    recommendation,
    narrative,
    result,
  };
}

export class EnterpriseStrategicAlignmentService {
  evaluate(
    input: CreateStrategicAlignmentContextInput,
  ): StrategicAlignmentServiceOutput {
    return evaluateEnterpriseStrategicAlignment(input);
  }
}
