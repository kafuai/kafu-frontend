import { ResilienceExecutionContext } from "./resilienceTypes";

export type FailoverTarget = {
  id: string;
  name: string;
  priority: number;
  healthy: boolean;
};

export function selectFailoverTarget(
  targets: FailoverTarget[],
): FailoverTarget | undefined {
  return [...targets]
    .filter((target) => target.healthy)
    .sort((a, b) => a.priority - b.priority)[0];
}

export function createFailoverContext(
  context: ResilienceExecutionContext,
  target: FailoverTarget,
): ResilienceExecutionContext {
  return {
    ...context,
    metadata: {
      ...context.metadata,
      failoverTargetId: target.id,
      failoverTargetName: target.name,
    },
  };
}