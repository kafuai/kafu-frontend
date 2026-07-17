import { EnterpriseDemoOrchestrationContext } from "./enterpriseDemoOrchestrationContext";
import { EnterpriseDemoOrchestrationService } from "./enterpriseDemoOrchestrationService";
import {
  EnterpriseDemoOrchestrationInput,
  EnterpriseDemoOrchestrationResult,
} from "./enterpriseDemoOrchestrationTypes";

export interface EnterpriseDemoOrchestrationCoordinationResult {
  context: EnterpriseDemoOrchestrationContext;
  result: EnterpriseDemoOrchestrationResult;
}

export class EnterpriseDemoOrchestrationCoordinator {
  constructor(
    private readonly service =
      new EnterpriseDemoOrchestrationService(),
  ) {}

  prepare(
    input: EnterpriseDemoOrchestrationInput,
  ): EnterpriseDemoOrchestrationCoordinationResult {
    const context = this.service.createContext(input);

    return {
      context,
      result: this.service.getResult(context),
    };
  }

  start(
    context: EnterpriseDemoOrchestrationContext,
  ): EnterpriseDemoOrchestrationCoordinationResult {
    const updatedContext = this.service.start(context);

    return {
      context: updatedContext,
      result: this.service.getResult(updatedContext),
    };
  }

  advance(
    context: EnterpriseDemoOrchestrationContext,
  ): EnterpriseDemoOrchestrationCoordinationResult {
    const updatedContext =
      this.service.completeCurrentStep(context);

    return {
      context: updatedContext,
      result: this.service.getResult(updatedContext),
    };
  }

  fail(
    context: EnterpriseDemoOrchestrationContext,
    reason: string,
  ): EnterpriseDemoOrchestrationCoordinationResult {
    const updatedContext =
      this.service.failCurrentStep(context, reason);

    return {
      context: updatedContext,
      result: this.service.getResult(updatedContext),
    };
  }
}
