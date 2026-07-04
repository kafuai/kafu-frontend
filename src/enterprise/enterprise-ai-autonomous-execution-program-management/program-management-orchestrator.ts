import { assessProgramHealth } from "./program-health-assessor";
import { assessProgramPriority } from "./program-priority-assessor";
import { buildProgramReadinessPlan } from "./program-readiness-planner";
import {
  mapProgramDependencies,
  ProgramDependencyMap,
} from "./program-dependency-mapper";
import {
  alignProgramExecution,
  ProgramExecutionAlignment,
} from "./program-execution-aligner";
import {
  ProgramDefinition,
  ProgramHealthAssessment,
  ProgramPriorityAssessment,
  ProgramReadinessPlan,
} from "./program-management-types";

export interface ProgramManagementResult {
  program: ProgramDefinition;
  health: ProgramHealthAssessment;
  priority: ProgramPriorityAssessment;
  readiness: ProgramReadinessPlan;
  dependencies: ProgramDependencyMap;
  alignment: ProgramExecutionAlignment;
  executiveSummary: string[];
}

function buildExecutiveSummary(
  health: ProgramHealthAssessment,
  priority: ProgramPriorityAssessment,
  readiness: ProgramReadinessPlan,
  dependencies: ProgramDependencyMap,
  alignment: ProgramExecutionAlignment
): string[] {
  const summary: string[] = [];

  summary.push(`Program health score is ${health.healthScore}.`);
  summary.push(`Program priority score is ${priority.priorityScore}.`);
  summary.push(`Program readiness score is ${readiness.readinessScore}.`);
  summary.push(`Dependency health is ${dependencies.dependencyHealth}.`);
  summary.push(`Execution alignment score is ${alignment.alignmentScore}.`);

  if (!readiness.readyToExecute) {
    summary.push("Program is not yet ready for full execution.");
  }

  if (!alignment.aligned) {
    summary.push("Program requires alignment stabilization.");
  }

  return summary;
}

export function manageProgramExecution(
  program: ProgramDefinition
): ProgramManagementResult {
  const health = assessProgramHealth(program);
  const priority = assessProgramPriority(program);
  const readiness = buildProgramReadinessPlan(program);
  const dependencies = mapProgramDependencies(program);
  const alignment = alignProgramExecution(program, health, priority);

  return {
    program,
    health,
    priority,
    readiness,
    dependencies,
    alignment,
    executiveSummary: buildExecutiveSummary(
      health,
      priority,
      readiness,
      dependencies,
      alignment
    ),
  };
}