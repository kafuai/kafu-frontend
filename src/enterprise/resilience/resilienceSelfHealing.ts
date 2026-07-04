import { ResilienceExecutionContext } from "./resilienceTypes";

export type SelfHealingAction = {
  id: string;
  name: string;
  description: string;
  execute(
    context: ResilienceExecutionContext,
  ): Promise<void> | void;
};

export async function executeSelfHealing(
  context: ResilienceExecutionContext,
  actions: SelfHealingAction[],
): Promise<number> {
  let completed = 0;

  for (const action of actions) {
    await action.execute(context);
    completed++;
  }

  return completed;
}