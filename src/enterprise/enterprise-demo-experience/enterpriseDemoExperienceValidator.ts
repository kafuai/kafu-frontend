import {
  EnterpriseDemoExperienceConfiguration,
  EnterpriseDemoExperienceScenarioOption,
} from "./enterpriseDemoExperienceTypes";

export class EnterpriseDemoExperienceValidator {
  validateConfiguration(
    configuration: EnterpriseDemoExperienceConfiguration,
  ): void {
    if (!configuration.organizationId.trim()) {
      throw new Error(
        "Enterprise demo experience organizationId is required.",
      );
    }

    if (!configuration.workspaceId.trim()) {
      throw new Error(
        "Enterprise demo experience workspaceId is required.",
      );
    }

    if (!configuration.title.trim()) {
      throw new Error(
        "Enterprise demo experience title is required.",
      );
    }

    if (!configuration.initiatedBy.trim()) {
      throw new Error(
        "Enterprise demo experience initiatedBy is required.",
      );
    }
  }

  validateScenarios(
    scenarios: EnterpriseDemoExperienceScenarioOption[],
  ): void {
    const ids = new Set<string>();

    for (const scenario of scenarios) {
      if (!scenario.id.trim()) {
        throw new Error(
          "Enterprise demo experience scenario id is required.",
        );
      }

      if (!scenario.title.trim()) {
        throw new Error(
          `Enterprise demo experience scenario ${scenario.id} title is required.`,
        );
      }

      if (ids.has(scenario.id)) {
        throw new Error(
          `Duplicate enterprise demo experience scenario id ${scenario.id}.`,
        );
      }

      if (
        scenario.estimatedDurationMinutes != null &&
        scenario.estimatedDurationMinutes < 0
      ) {
        throw new Error(
          `Enterprise demo experience scenario ${scenario.id} duration cannot be negative.`,
        );
      }

      ids.add(scenario.id);
    }
  }
}
