export type BusinessRecoveryProcedureStep = {
  id: string;
  title: string;
  description: string;
  order: number;
  required: boolean;
};

export type BusinessRecoveryProcedure = {
  id: string;
  name: string;
  strategyId: string;
  steps: BusinessRecoveryProcedureStep[];
};

export function sortRecoveryProcedureSteps(
  procedure: BusinessRecoveryProcedure,
): BusinessRecoveryProcedure {
  return {
    ...procedure,
    steps: [...procedure.steps].sort((a, b) => a.order - b.order),
  };
}

export function validateRecoveryProcedure(
  procedure: BusinessRecoveryProcedure,
): boolean {
  if (procedure.steps.length === 0) {
    return false;
  }

  return procedure.steps.every((step) => step.title.trim().length > 0);
}

export function getRequiredRecoverySteps(
  procedure: BusinessRecoveryProcedure,
): BusinessRecoveryProcedureStep[] {
  return procedure.steps.filter((step) => step.required);
}