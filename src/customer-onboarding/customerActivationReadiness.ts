export interface CustomerActivationReadinessInput {
  workspaceReady: boolean;
  usersInvited: boolean;
  organizationConfigured: boolean;
  discoveryValidated: boolean;
  trainingCompleted: boolean;
}

export interface CustomerActivationReadinessResult {
  ready: boolean;
  readinessScore: number;
  missingRequirements: string[];
}

export function evaluateCustomerActivationReadiness(
  input: CustomerActivationReadinessInput,
): CustomerActivationReadinessResult {
  const requirements = [
    {
      completed: input.workspaceReady,
      label: "Workspace is not ready.",
    },
    {
      completed: input.usersInvited,
      label: "Customer users have not been invited.",
    },
    {
      completed: input.organizationConfigured,
      label: "Organization configuration is incomplete.",
    },
    {
      completed: input.discoveryValidated,
      label: "Discovery has not been validated.",
    },
    {
      completed: input.trainingCompleted,
      label: "Customer training is incomplete.",
    },
  ];

  const completedCount = requirements.filter(
    (requirement) => requirement.completed,
  ).length;

  const missingRequirements = requirements
    .filter((requirement) => !requirement.completed)
    .map((requirement) => requirement.label);

  return {
    ready: missingRequirements.length === 0,
    readinessScore: Math.round(
      (completedCount / requirements.length) * 100,
    ),
    missingRequirements,
  };
}
