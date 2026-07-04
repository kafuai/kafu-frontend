import { validateBackup } from "./backupValidation";
import { BackupStrategy } from "./backupStrategies";
import {
  completeFailover,
  FailoverExecution,
  FailoverRequest,
  startFailover,
} from "./failoverManagement";
import {
  createRecoveryAutomationRun,
  isRecoveryAutomationComplete,
  RecoveryAutomationRun,
  RecoveryAutomationStep,
} from "./recoveryAutomation";
import {
  assessDisasterRecoveryPlan,
  createDisasterRecoveryPlan,
} from "./disasterRecoveryPlan";
import {
  DisasterRecoveryAssessment,
  DisasterRecoveryPlan,
  DisasterRecoveryPlanInput,
} from "./disasterRecoveryTypes";

export type DisasterRecoveryExecutionResult = {
  plan: DisasterRecoveryPlan;
  assessment: DisasterRecoveryAssessment;
};

export type DisasterRecoveryFailoverResult = {
  execution: FailoverExecution;
  completed: boolean;
};

export type DisasterRecoveryAutomationResult = {
  run: RecoveryAutomationRun;
  completed: boolean;
};

export function prepareDisasterRecoveryPlan(
  input: DisasterRecoveryPlanInput,
): DisasterRecoveryExecutionResult {
  const plan = createDisasterRecoveryPlan(input);
  const assessment = assessDisasterRecoveryPlan(plan);

  return {
    plan,
    assessment,
  };
}

export function executeDisasterRecoveryFailover(
  request: FailoverRequest,
): DisasterRecoveryFailoverResult {
  const execution = completeFailover(startFailover(request));

  return {
    execution,
    completed: execution.status === "completed",
  };
}

export function executeRecoveryAutomation(
  planId: string,
  steps: RecoveryAutomationStep[],
): DisasterRecoveryAutomationResult {
  const run = createRecoveryAutomationRun(planId, steps);

  return {
    run,
    completed: isRecoveryAutomationComplete(run),
  };
}

export function validateDisasterRecoveryBackups(
  strategies: BackupStrategy[],
): ReturnType<typeof validateBackup>[] {
  return strategies.map((strategy) => validateBackup(strategy));
}