import {
  AIEvaluationResult,
  AIEvaluationRun,
  AIEvaluationScore,
} from "./aiEvaluationTypes";
import { calculateEvaluationResult } from "./aiEvaluationCalculator";
import { validateEvaluationRun } from "./aiEvaluationValidator";

export class AIEvaluationRunner {
  run(
    evaluationRun: AIEvaluationRun,
    scoreProvider: (
      sampleId: string,
    ) => AIEvaluationScore[],
  ): AIEvaluationRun {
    validateEvaluationRun(evaluationRun);

    evaluationRun.status = "running";
    evaluationRun.startedAt = new Date();
    evaluationRun.results = [];

    for (const sample of evaluationRun.samples) {
      const scores = scoreProvider(sample.id);

      const summary = calculateEvaluationResult(
        evaluationRun.criteria,
        scores,
      );

      const result: AIEvaluationResult = {
        id: `${evaluationRun.id}-${sample.id}`,
        organizationId: evaluationRun.organizationId,
        runId: evaluationRun.id,
        sampleId: sample.id,
        scores,
        totalScore: summary.totalScore,
        maximumScore: summary.maximumScore,
        percentageScore: summary.percentageScore,
        grade: summary.grade,
        riskLevel: summary.riskLevel,
        passed: summary.passed,
        findings: [],
        recommendations: [],
        evaluatedAt: new Date(),
      };

      evaluationRun.results.push(result);
    }

    evaluationRun.status = "completed";
    evaluationRun.completedAt = new Date();
    evaluationRun.updatedAt = new Date();

    return evaluationRun;
  }
}