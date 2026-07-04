import {
  ProgramDefinition,
  ProgramReadinessPlan,
} from "./program-management-types";

export function buildProgramReadinessPlan(
  program: ProgramDefinition
): ProgramReadinessPlan {
  let score = 100;

  const requiredActions: string[] = [];
  const recommendedSequence: string[] = [];

  if (program.objectives.length === 0) {
    score -= 25;
    requiredActions.push("Define strategic objectives.");
  }

  if (program.milestones.length === 0) {
    score -= 20;
    requiredActions.push("Create execution milestones.");
  }

  const blocked = program.dependencies.filter(
    dependency => dependency.status === "blocked"
  );

  if (blocked.length > 0) {
    score -= blocked.length * 10;
    requiredActions.push("Resolve blocked dependencies.");
  }

  if (program.risks.length > 0) {
    requiredActions.push("Review and mitigate program risks.");
  }

  recommendedSequence.push("Validate strategic alignment.");
  recommendedSequence.push("Confirm dependency readiness.");
  recommendedSequence.push("Approve execution plan.");
  recommendedSequence.push("Start coordinated execution.");

  score = Math.max(0, Math.min(100, Math.round(score)));

  return {
    programId: program.id,
    readinessScore: score,
    readyToExecute: score >= 75,
    requiredActions,
    recommendedSequence,
  };
}