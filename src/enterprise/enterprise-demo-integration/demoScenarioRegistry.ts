import {
  EnterpriseDemoScenario,
  EnterpriseDemoScenarioStatus,
} from "./demoIntegrationTypes";

export interface DemoScenarioListOptions {
  organizationId?: string;
  status?: EnterpriseDemoScenarioStatus;
  tags?: string[];
  includeDisabled?: boolean;
}

export class DemoScenarioRegistry {
  private readonly scenarios =
    new Map<string, EnterpriseDemoScenario>();

  register(
    scenario: EnterpriseDemoScenario,
  ): EnterpriseDemoScenario {
    this.validateScenario(scenario);

    if (this.scenarios.has(scenario.id)) {
      throw new Error(
        `Demo scenario ${scenario.id} is already registered.`,
      );
    }

    const registeredScenario = this.cloneScenario(scenario);

    this.scenarios.set(
      registeredScenario.id,
      registeredScenario,
    );

    return this.cloneScenario(registeredScenario);
  }

  upsert(
    scenario: EnterpriseDemoScenario,
  ): EnterpriseDemoScenario {
    this.validateScenario(scenario);

    const storedScenario = this.cloneScenario({
      ...scenario,
      updatedAt: new Date().toISOString(),
    });

    this.scenarios.set(
      storedScenario.id,
      storedScenario,
    );

    return this.cloneScenario(storedScenario);
  }

  get(id: string): EnterpriseDemoScenario | null {
    const scenario = this.scenarios.get(id);

    return scenario
      ? this.cloneScenario(scenario)
      : null;
  }

  has(id: string): boolean {
    return this.scenarios.has(id);
  }

  remove(id: string): boolean {
    return this.scenarios.delete(id);
  }

  list(
    options: DemoScenarioListOptions = {},
  ): EnterpriseDemoScenario[] {
    const requestedTags = options.tags ?? [];

    return Array.from(this.scenarios.values())
      .filter((scenario) => {
        if (
          options.organizationId &&
          scenario.organizationId !== options.organizationId
        ) {
          return false;
        }

        if (
          options.status &&
          scenario.status !== options.status
        ) {
          return false;
        }

        if (
          !options.includeDisabled &&
          scenario.status === "disabled"
        ) {
          return false;
        }

        if (
          requestedTags.length > 0 &&
          !requestedTags.every((tag) =>
            scenario.tags.includes(tag),
          )
        ) {
          return false;
        }

        return true;
      })
      .sort((left, right) => {
        if (left.priority !== right.priority) {
          return left.priority - right.priority;
        }

        return left.title.localeCompare(right.title);
      })
      .map((scenario) =>
        this.cloneScenario(scenario),
      );
  }

  clear(): void {
    this.scenarios.clear();
  }

  count(): number {
    return this.scenarios.size;
  }

  private validateScenario(
    scenario: EnterpriseDemoScenario,
  ): void {
    if (!scenario.id.trim()) {
      throw new Error("Demo scenario id is required.");
    }

    if (!scenario.organizationId.trim()) {
      throw new Error(
        "Demo scenario organizationId is required.",
      );
    }

    if (!scenario.title.trim()) {
      throw new Error(
        "Demo scenario title is required.",
      );
    }

    if (!scenario.entryPoint.trim()) {
      throw new Error(
        "Demo scenario entryPoint is required.",
      );
    }

    if (!Number.isFinite(scenario.priority)) {
      throw new Error(
        "Demo scenario priority must be a finite number.",
      );
    }
  }

  private cloneScenario(
    scenario: EnterpriseDemoScenario,
  ): EnterpriseDemoScenario {
    return {
      ...scenario,
      tags: [...scenario.tags],
    };
  }
}
