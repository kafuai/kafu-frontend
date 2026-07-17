import {
  DemoDiagnostics,
  EnterpriseDemoDiagnostic,
} from "../enterprise-demo-integration";
import {
  EnterpriseDemoRuntimeContext,
} from "./enterpriseDemoRuntimeContext";

export interface EnterpriseDemoRuntimeDiagnosticReport {
  status: "healthy" | "warning" | "critical";
  score: number;
  summary: string;
  diagnostics: EnterpriseDemoDiagnostic[];
  generatedAt: string;
}

export class EnterpriseDemoRuntimeDiagnostics {
  constructor(
    private readonly diagnostics:
      DemoDiagnostics,
    private readonly context:
      EnterpriseDemoRuntimeContext,
  ) {}

  run(): EnterpriseDemoRuntimeDiagnosticReport {
    const runtimeContext =
      this.context.getSnapshot();

    const report =
      this.diagnostics.run();

    const status =
      report.diagnostics.some(
        (diagnostic) =>
          diagnostic.severity === "critical",
      )
        ? "critical"
        : report.diagnostics.some(
              (diagnostic) =>
                diagnostic.severity === "warning",
            )
          ? "warning"
          : "healthy";

    return {
      status,
      score: report.score,
      summary: report.summary,
      diagnostics: report.diagnostics.map(
        (diagnostic) => ({
          ...diagnostic,
          details: {
            ...(diagnostic.details ?? {}),
            runtimeStatus:
              runtimeContext.status,
            organizationId:
              runtimeContext.configuration
                .organizationId,
            workspaceId:
              runtimeContext.configuration
                .workspaceId,
          },
        }),
      ),
      generatedAt: report.generatedAt,
    };
  }
}
