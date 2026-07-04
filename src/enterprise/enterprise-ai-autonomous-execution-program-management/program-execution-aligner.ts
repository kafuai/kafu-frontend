import {
  ProgramDefinition,
  ProgramHealthAssessment,
  ProgramPriorityAssessment,
} from "./program-management-types";

export interface ProgramExecutionAlignment {
  programId: string;
  aligned: boolean;
  alignmentScore: number;
  alignmentFindings: string[];
  executionGuidance: string[];
}

export function alignProgramExecution(
  program: ProgramDefinition,
  health: ProgramHealthAssessment,
  priority: ProgramPriorityAssessment
): ProgramExecutionAlignment {
  let score = 100;

  const alignmentFindings: string[] = [];
  const executionGuidance: string[] = [];

  if (program.portfolioId.trim().length === 0) {
    score -= 25;
    alignmentFindings.push("Program is not attached to a portfolio.");
  }

  if (program.objectives.length === 0) {
    score -= 25;
    alignmentFindings.push("Program has no strategic objectives.");
  }

  if (health.healthScore < 60) {
    score -= 20;
    alignmentFindings.push("Program health is below execution threshold.");
  }

  if (priority.priorityScore < 40) {
    score -= 10;
    alignmentFindings.push("Program priority score is low.");
  }

  if (program.status === "blocked") {
    score -= 20;
    alignmentFindings.push("Program execution is currently blocked.");
  }

  if (alignmentFindings.length === 0) {
    alignmentFindings.push("Program execution is aligned with portfolio intent.");
  }

  if (score >= 75) {
    executionGuidance.push("Continue coordinated program execution.");
  } else {
    executionGuidance.push("Stabilize program alignment before expanding scope.");
  }

  score = Math.max(0, Math.min(100, Math.round(score)));

  return {
    programId: program.id,
    aligned: score >= 75,
    alignmentScore: score,
    alignmentFindings,
    executionGuidance,
  };
}