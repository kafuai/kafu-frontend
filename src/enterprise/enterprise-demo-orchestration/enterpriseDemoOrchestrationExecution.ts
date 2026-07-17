import { EnterpriseDemoOrchestrationContext } from "./enterpriseDemoOrchestrationContext";
import { EnterpriseDemoOrchestrationEngine } from "./enterpriseDemoOrchestrationEngine";
import {
  EnterpriseDemoOrchestrationInput,
  EnterpriseDemoOrchestrationResult,
} from "./enterpriseDemoOrchestrationTypes";

export interface EnterpriseDemoOrchestrationExecution {
  context: EnterpriseDemoOrchestrationContext;
  result: EnterpriseDemoOrchestrationResult;
}

export async function executeEnterpriseDemoOrchestration(
  input: EnterpriseDemoOrchestrationInput,
  engine = new EnterpriseDemoOrchestrationEngine(),
): Promise<EnterpriseDemoOrchestrationExecution> {
  let execution = engine.prepare(input);
  execution = engine.start(execution.context);

  while (
    execution.context.status === "running" &&
    execution.context.plan.currentStepId
  ) {
    execution = engine.advance(execution.context);
  }

  return {
    context: execution.context,
    result: execution.result,
  };
}

export function startEnterpriseDemoOrchestrationExecution(
  input: EnterpriseDemoOrchestrationInput,
  engine = new EnterpriseDemoOrchestrationEngine(),
): EnterpriseDemoOrchestrationExecution {
  const prepared = engine.prepare(input);
  const started = engine.start(prepared.context);

  return {
    context: started.context,
    result: started.result,
  };
}
