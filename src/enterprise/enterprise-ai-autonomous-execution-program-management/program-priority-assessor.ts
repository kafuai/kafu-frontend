import {
  ProgramDefinition,
  ProgramPriorityAssessment,
} from "./program-management-types";

function priorityWeight(priority: ProgramDefinition["strategicPriority"]): number {
  switch (priority) {
    case "critical":
      return 40;
    case "high":
      return 30;
    case "medium":
      return 20;
    case "low":
      return 10;
  }
}

function riskPenalty(program: ProgramDefinition): number {
  return program.risks.reduce((penalty, risk) => {
    switch (risk.impact) {
      case "critical":
        return penalty + 12;
      case "high":
        return penalty + 8;
      case "medium":
        return penalty + 4;
      default:
        return penalty + 1;
    }
  }, 0);
}

export function assessProgramPriority(
  program: ProgramDefinition
): ProgramPriorityAssessment {
  let score = 0;
  const rationale: string[] = [];

  score += priorityWeight(program.strategicPriority);
  rationale.push(
    `Strategic priority: ${program.strategicPriority}.`
  );

  score += Math.min(program.objectives.length * 6, 24);
  rationale.push(`${program.objectives.length} strategic objectives evaluated.`);

  score += Math.min(program.milestones.length * 3, 15);

  const penalty = riskPenalty(program);
  score -= penalty;

  if (penalty > 0) {
    rationale.push(`Risk penalty applied: ${penalty}.`);
  }

  score = Math.max(0, Math.min(100, Math.round(score)));

  return {
    programId: program.id,
    priorityScore: score,
    priority: program.strategicPriority,
    rationale,
  };
}