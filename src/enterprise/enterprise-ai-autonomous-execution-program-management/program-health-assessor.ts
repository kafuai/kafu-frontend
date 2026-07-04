import {
  ProgramDefinition,
  ProgramHealthAssessment,
  ProgramExecutionStatus,
} from "./program-management-types";

function scoreStatus(status: ProgramExecutionStatus): number {
  switch (status) {
    case "completed":
      return 100;
    case "active":
      return 80;
    case "planned":
      return 65;
    case "at-risk":
      return 40;
    case "blocked":
      return 15;
    default:
      return 50;
  }
}

function clampScore(score: number): number {
  return Math.max(0, Math.min(100, Math.round(score)));
}

export function assessProgramHealth(
  program: ProgramDefinition
): ProgramHealthAssessment {
  const blockers: string[] = [];
  const warnings: string[] = [];
  const recommendations: string[] = [];

  let score = scoreStatus(program.status);

  const blockedDependencies = program.dependencies.filter(
    (dependency) => dependency.status === "blocked"
  );

  const delayedDependencies = program.dependencies.filter(
    (dependency) => dependency.status === "delayed"
  );

  const criticalRisks = program.risks.filter(
    (risk) => risk.impact === "critical" || risk.likelihood === "critical"
  );

  const incompleteMilestones = program.milestones.filter(
    (milestone) => milestone.completionPercentage < 100
  );

  if (blockedDependencies.length > 0) {
    blockers.push(
      `${blockedDependencies.length} blocking program dependencies detected.`
    );
    score -= blockedDependencies.length * 18;
  }

  if (delayedDependencies.length > 0) {
    warnings.push(
      `${delayedDependencies.length} delayed program dependencies require attention.`
    );
    score -= delayedDependencies.length * 8;
  }

  if (criticalRisks.length > 0) {
    warnings.push(`${criticalRisks.length} critical program risks detected.`);
    score -= criticalRisks.length * 12;
  }

  if (program.objectives.length === 0) {
    blockers.push("Program has no defined strategic objectives.");
    score -= 25;
  }

  if (program.milestones.length === 0) {
    warnings.push("Program has no execution milestones.");
    score -= 10;
  }

  if (incompleteMilestones.length > 0 && program.status === "completed") {
    warnings.push("Program is marked completed while milestones remain open.");
    score -= 15;
  }

  if (blockers.length > 0) {
    recommendations.push("Resolve blocking dependencies before scaling execution.");
  }

  if (warnings.length > 0) {
    recommendations.push("Review risks, delays, and incomplete milestones weekly.");
  }

  if (recommendations.length === 0) {
    recommendations.push("Continue current program execution cadence.");
  }

  return {
    programId: program.id,
    healthScore: clampScore(score),
    status: program.status,
    blockers,
    warnings,
    recommendations,
  };
}