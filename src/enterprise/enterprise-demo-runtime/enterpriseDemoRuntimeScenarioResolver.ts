import {
  DemoScenarioRegistry,
  EnterpriseDemoScenario,
} from "../enterprise-demo-integration";

export interface EnterpriseDemoRuntimeScenarioResolverInput {
  requestedScenarioId?: string | null;
  defaultScenarioId?: string | null;
  organizationId: string;
}

export class EnterpriseDemoRuntimeScenarioResolver {
  constructor(
    private readonly scenarioRegistry:
      DemoScenarioRegistry,
  ) {}

  resolve(
    input: EnterpriseDemoRuntimeScenarioResolverInput,
  ): EnterpriseDemoScenario {
    const requestedScenarioId =
      input.requestedScenarioId ??
      input.defaultScenarioId ??
      null;

    if (requestedScenarioId) {
      const requestedScenario =
        this.scenarioRegistry.get(
          requestedScenarioId,
        );

      if (!requestedScenario) {
        throw new Error(
          `Enterprise demo scenario ${requestedScenarioId} was not found.`,
        );
      }

      if (
        requestedScenario.organizationId !==
        input.organizationId
      ) {
        throw new Error(
          `Enterprise demo scenario ${requestedScenarioId} does not belong to organization ${input.organizationId}.`,
        );
      }

      if (
        requestedScenario.status === "disabled"
      ) {
        throw new Error(
          `Enterprise demo scenario ${requestedScenarioId} is disabled.`,
        );
      }

      return requestedScenario;
    }

    const scenarios =
      this.scenarioRegistry.list({
        organizationId: input.organizationId,
        includeDisabled: false,
      });

    const scenario =
      scenarios.find(
        (item) =>
          item.status === "ready" ||
          item.status === "active",
      ) ??
      scenarios[0];

    if (!scenario) {
      throw new Error(
        `No enterprise demo scenario is available for organization ${input.organizationId}.`,
      );
    }

    return scenario;
  }
}
