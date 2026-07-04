import {
  ProgramDefinition,
  ProgramDependency,
  ProgramDependencyStatus,
  ProgramRiskLevel,
} from "./program-management-types";

export interface ProgramDependencyMap {
  programId: string;
  totalDependencies: number;
  blockedDependencies: ProgramDependency[];
  delayedDependencies: ProgramDependency[];
  criticalDependencies: ProgramDependency[];
  dependencyHealth: ProgramDependencyStatus;
  recommendations: string[];
}

function resolveDependencyHealth(
  blocked: number,
  delayed: number
): ProgramDependencyStatus {
  if (blocked > 0) {
    return "blocked";
  }

  if (delayed > 0) {
    return "delayed";
  }

  return "healthy";
}

function isCriticalImpact(level: ProgramRiskLevel): boolean {
  return level === "critical" || level === "high";
}

export function mapProgramDependencies(
  program: ProgramDefinition
): ProgramDependencyMap {
  const blockedDependencies = program.dependencies.filter(
    dependency => dependency.status === "blocked"
  );

  const delayedDependencies = program.dependencies.filter(
    dependency => dependency.status === "delayed"
  );

  const criticalDependencies = program.dependencies.filter(
    dependency => isCriticalImpact(dependency.impactLevel)
  );

  const recommendations: string[] = [];

  if (blockedDependencies.length > 0) {
    recommendations.push("Escalate blocked dependencies immediately.");
  }

  if (delayedDependencies.length > 0) {
    recommendations.push("Re-plan delayed dependency timelines.");
  }

  if (criticalDependencies.length > 0) {
    recommendations.push("Add executive visibility for high-impact dependencies.");
  }

  if (recommendations.length === 0) {
    recommendations.push("Maintain dependency review cadence.");
  }

  return {
    programId: program.id,
    totalDependencies: program.dependencies.length,
    blockedDependencies,
    delayedDependencies,
    criticalDependencies,
    dependencyHealth: resolveDependencyHealth(
      blockedDependencies.length,
      delayedDependencies.length
    ),
    recommendations,
  };
}