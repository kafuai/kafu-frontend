import {
  calculateExecutiveDemoFinalIntegrationReadiness,
  markExecutiveDemoFinalIntegrationReady,
  releaseExecutiveDemoFinalIntegration,
} from "./executiveDemoFinalIntegration";
import {
  buildExecutiveDemoFinalIntegration,
} from "./executiveDemoFinalIntegrationBuilder";
import {
  ExecutiveDemoFinalIntegrationContext,
} from "./executiveDemoFinalIntegrationContext";
import {
  ExecutiveDemoFinalIntegration,
  ExecutiveDemoFinalIntegrationIssue,
} from "./executiveDemoFinalIntegrationTypes";
import {
  assertExecutiveDemoFinalIntegrationValid,
} from "./executiveDemoFinalIntegrationValidator";

export interface ExecutiveDemoFinalIntegrationEngineInput {
  context: ExecutiveDemoFinalIntegrationContext;
  title?: string;
  issues?: ExecutiveDemoFinalIntegrationIssue[];
  autoPrepare?: boolean;
}

export class ExecutiveDemoFinalIntegrationEngine {
  create(
    input: ExecutiveDemoFinalIntegrationEngineInput,
  ): ExecutiveDemoFinalIntegration {
    return buildExecutiveDemoFinalIntegration({
      context: input.context,
      title: input.title,
      issues: input.issues,
      markReady: input.autoPrepare ?? true,
    });
  }

  refresh(
    integration: ExecutiveDemoFinalIntegration,
  ): ExecutiveDemoFinalIntegration {
    const refreshedIntegration: ExecutiveDemoFinalIntegration = {
      ...integration,
      readiness:
        calculateExecutiveDemoFinalIntegrationReadiness(integration),
      updatedAt: new Date().toISOString(),
    };

    assertExecutiveDemoFinalIntegrationValid(refreshedIntegration);

    return refreshedIntegration;
  }

  validate(
    integration: ExecutiveDemoFinalIntegration,
  ): ExecutiveDemoFinalIntegration {
    const preparedIntegration =
      markExecutiveDemoFinalIntegrationReady(integration);

    assertExecutiveDemoFinalIntegrationValid(preparedIntegration);

    return {
      ...preparedIntegration,
      status: preparedIntegration.readiness.releaseReady
        ? "validated"
        : "assembling",
      validatedAt: preparedIntegration.readiness.releaseReady
        ? new Date().toISOString()
        : undefined,
      updatedAt: new Date().toISOString(),
    };
  }

  release(
    integration: ExecutiveDemoFinalIntegration,
  ): ExecutiveDemoFinalIntegration {
    const validatedIntegration = this.validate(integration);

    return releaseExecutiveDemoFinalIntegration(validatedIntegration);
  }
}
