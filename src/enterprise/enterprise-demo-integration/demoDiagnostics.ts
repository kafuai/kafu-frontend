import {
  EnterpriseDemoDiagnostic,
  EnterpriseDemoSeverity,
} from "./demoIntegrationTypes";
import { DemoDataInjector } from "./demoDataInjector";
import { DemoScenarioRegistry } from "./demoScenarioRegistry";
import { DemoSessionRuntime } from "./demoSessionRuntime";
import { DemoState } from "./demoState";

export interface EnterpriseDemoDiagnosticsReport {
  healthy: boolean;
  score: number;
  diagnostics: EnterpriseDemoDiagnostic[];
  generatedAt: string;
  summary: string;
}

export interface DemoDiagnosticsDependencies {
  scenarioRegistry: DemoScenarioRegistry;
  sessionRuntime: DemoSessionRuntime;
  state: DemoState;
  dataInjector: DemoDataInjector;
}

export class DemoDiagnostics {
  constructor(
    private readonly dependencies: DemoDiagnosticsDependencies,
  ) {}

  run(): EnterpriseDemoDiagnosticsReport {
    const diagnostics: EnterpriseDemoDiagnostic[] = [];

    this.checkScenarioRegistry(diagnostics);
    this.checkSessionRuntime(diagnostics);
    this.checkDatasets(diagnostics);
    this.checkState(diagnostics);

    const criticalCount = diagnostics.filter(
      (diagnostic) =>
        diagnostic.severity === "critical",
    ).length;

    const warningCount = diagnostics.filter(
      (diagnostic) =>
        diagnostic.severity === "warning",
    ).length;

    const score = Math.max(
      0,
      100 - criticalCount * 35 - warningCount * 10,
    );

    const healthy = criticalCount === 0;

    return {
      healthy,
      score,
      diagnostics,
      generatedAt: new Date().toISOString(),
      summary: healthy
        ? `Enterprise demo integration is healthy with score ${score}.`
        : `Enterprise demo integration requires attention with score ${score}.`,
    };
  }

  private checkScenarioRegistry(
    diagnostics: EnterpriseDemoDiagnostic[],
  ): void {
    const scenarioCount =
      this.dependencies.scenarioRegistry.count();

    if (scenarioCount === 0) {
      diagnostics.push(
        this.createDiagnostic(
          "warning",
          "scenario-registry",
          "No enterprise demo scenarios are registered.",
          {
            scenarioCount,
          },
        ),
      );

      return;
    }

    diagnostics.push(
      this.createDiagnostic(
        "info",
        "scenario-registry",
        `${scenarioCount} enterprise demo scenario(s) registered.`,
        {
          scenarioCount,
        },
      ),
    );
  }

  private checkSessionRuntime(
    diagnostics: EnterpriseDemoDiagnostic[],
  ): void {
    const sessionCount =
      this.dependencies.sessionRuntime.count();

    diagnostics.push(
      this.createDiagnostic(
        "info",
        "session-runtime",
        `${sessionCount} enterprise demo session(s) available.`,
        {
          sessionCount,
        },
      ),
    );
  }

  private checkDatasets(
    diagnostics: EnterpriseDemoDiagnostic[],
  ): void {
    const datasetCount =
      this.dependencies.dataInjector.count();

    if (datasetCount === 0) {
      diagnostics.push(
        this.createDiagnostic(
          "warning",
          "data-injector",
          "No enterprise demo datasets are registered.",
          {
            datasetCount,
          },
        ),
      );

      return;
    }

    diagnostics.push(
      this.createDiagnostic(
        "info",
        "data-injector",
        `${datasetCount} enterprise demo dataset(s) registered.`,
        {
          datasetCount,
        },
      ),
    );
  }

  private checkState(
    diagnostics: EnterpriseDemoDiagnostic[],
  ): void {
    try {
      const snapshot =
        this.dependencies.state.getSnapshot();

      diagnostics.push(
        this.createDiagnostic(
          snapshot.status === "failed"
            ? "critical"
            : "info",
          "demo-state",
          `Enterprise demo state is ${snapshot.status}.`,
          {
            organizationId:
              snapshot.organizationId,
            workspaceId: snapshot.workspaceId,
            activeSessionId:
              snapshot.activeSessionId ?? null,
            activeScenarioId:
              snapshot.activeScenarioId ?? null,
          },
        ),
      );
    } catch {
      diagnostics.push(
        this.createDiagnostic(
          "critical",
          "demo-state",
          "Enterprise demo state is not initialized.",
        ),
      );
    }
  }

  private createDiagnostic(
    severity: EnterpriseDemoSeverity,
    component: string,
    message: string,
    details?: Record<string, unknown>,
  ): EnterpriseDemoDiagnostic {
    return {
      id: `demo-diagnostic-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 8)}`,
      severity,
      component,
      message,
      details,
      createdAt: new Date().toISOString(),
    };
  }
}
