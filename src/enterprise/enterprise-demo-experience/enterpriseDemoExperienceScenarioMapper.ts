import {
  EnterpriseDemoScenario,
} from "../enterprise-demo-integration";
import {
  EnterpriseDemoExperienceScenarioOption,
} from "./enterpriseDemoExperienceTypes";

export class EnterpriseDemoExperienceScenarioMapper {
  map(
    scenario: EnterpriseDemoScenario,
  ): EnterpriseDemoExperienceScenarioOption {
    return {
      id: scenario.id,
      title: scenario.title,
      description: null,
      category: null,
      estimatedDurationMinutes: null,
      recommended: false,
      enabled:
        scenario.status !== "disabled" &&
        scenario.status !== "failed",
    };
  }

  mapMany(
    scenarios: EnterpriseDemoScenario[],
  ): EnterpriseDemoExperienceScenarioOption[] {
    return scenarios.map(
      (scenario) => this.map(scenario),
    );
  }
}
