import {
  ProductionReadinessQACheck,
  ProductionReadinessQAReportInput,
} from "./productionReadinessQATypes";

export interface ProductionReadinessQAContextInput {
  organizationId: string;
  companyName: string;
  buildPassed?: boolean;
  typeScriptPassed?: boolean;
  routesValidated?: boolean;
  securityValidated?: boolean;
  accessibilityValidated?: boolean;
  performanceValidated?: boolean;
  dataIntegrityValidated?: boolean;
  demoValidated?: boolean;
  deploymentValidated?: boolean;
}

export interface ProductionReadinessQAContext {
  organizationId: string;
  companyName: string;
  checks: ProductionReadinessQACheck[];
  contextSummary: string;
}

function buildCheck(
  id: string,
  title: string,
  description: string,
  category: ProductionReadinessQACheck["category"],
  passed: boolean,
  severity: ProductionReadinessQACheck["severity"] = "high",
): ProductionReadinessQACheck {
  return {
    id,
    title,
    description,
    category,
    severity,
    status: passed ? "passed" : "pending",
    required: true,
    checkedAt: passed
      ? new Date().toISOString()
      : undefined,
  };
}

export function buildProductionReadinessQAContext(
  input: ProductionReadinessQAContextInput,
): ProductionReadinessQAContext {
  const checks: ProductionReadinessQACheck[] = [
    buildCheck(
      "production-build",
      "Production build passes",
      "Confirm that the optimized production build completes successfully.",
      "build",
      input.buildPassed ?? true,
      "critical",
    ),
    buildCheck(
      "typescript-validation",
      "TypeScript validation passes",
      "Confirm that the application contains no TypeScript compilation errors.",
      "type-safety",
      input.typeScriptPassed ?? true,
      "critical",
    ),
    buildCheck(
      "route-validation",
      "Application routes validated",
      "Confirm that all executive demo and workspace routes load correctly.",
      "routing",
      input.routesValidated ?? true,
    ),
    buildCheck(
      "security-validation",
      "Security controls validated",
      "Confirm that production security controls and environment handling are valid.",
      "security",
      input.securityValidated ?? false,
      "critical",
    ),
    buildCheck(
      "accessibility-validation",
      "Accessibility validated",
      "Confirm keyboard access, labels, contrast, and semantic structure.",
      "accessibility",
      input.accessibilityValidated ?? false,
      "medium",
    ),
    buildCheck(
      "performance-validation",
      "Performance validated",
      "Confirm acceptable page loading and interaction performance.",
      "performance",
      input.performanceValidated ?? false,
    ),
    buildCheck(
      "data-integrity-validation",
      "Data integrity validated",
      "Confirm safe handling of enterprise demo and workspace data.",
      "data-integrity",
      input.dataIntegrityValidated ?? false,
      "critical",
    ),
    buildCheck(
      "executive-demo-validation",
      "Executive demo validated",
      "Confirm that the complete executive demo journey runs end to end.",
      "demo-readiness",
      input.demoValidated ?? false,
      "critical",
    ),
    buildCheck(
      "deployment-validation",
      "Deployment validated",
      "Confirm that the release can be deployed and accessed successfully.",
      "deployment",
      input.deploymentValidated ?? false,
      "critical",
    ),
  ];

  const passedChecks = checks.filter(
    (check) => check.status === "passed",
  ).length;

  return {
    organizationId: input.organizationId.trim(),
    companyName: input.companyName.trim(),
    checks,
    contextSummary:
      `${input.companyName.trim()} production readiness context includes ` +
      `${passedChecks} of ${checks.length} checks currently passed.`,
  };
}

export function buildProductionReadinessQAReportInput(
  context: ProductionReadinessQAContext,
): ProductionReadinessQAReportInput {
  return {
    organizationId: context.organizationId,
    companyName: context.companyName,
    title: `${context.companyName} Production Readiness & QA`,
    checks: context.checks,
    issues: [],
  };
}
