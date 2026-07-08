export interface CustomerSuccessPlan {
  accountId: string;
  objectives: string[];
  milestones: string[];
  ownerId: string;
  dueDate?: Date;
}

export function addSuccessObjective(
  plan: CustomerSuccessPlan,
  objective: string,
): CustomerSuccessPlan {
  return {
    ...plan,
    objectives: [...plan.objectives, objective],
  };
}