import {
  DemoValidationCheck,
  DemoValidationReportInput,
} from "./demoValidationTypes";

export interface DemoValidationContextInput {
  organizationId: string;
  companyName: string;
  executiveJourneyPassed?: boolean;
  presentationPassed?: boolean;
  navigationPassed?: boolean;
  dataPassed?: boolean;
  performancePassed?: boolean;
  uiPassed?: boolean;
  businessValuePassed?: boolean;
  executiveExperiencePassed?: boolean;
}

export interface DemoValidationContext {
  organizationId: string;
  companyName: string;
  checks: DemoValidationCheck[];
  contextSummary: string;
}

function buildCheck(
  id: string,
  title: string,
  description: string,
  category: DemoValidationCheck["category"],
  passed: boolean,
  severity: DemoValidationCheck["severity"]="high",
): DemoValidationCheck {
  return {
    id,
    title,
    description,
    category,
    severity,
    status: passed ? "passed" : "pending",
    required: true,
    validatedAt: passed ? new Date().toISOString() : undefined,
  };
}

export function buildDemoValidationContext(
  input: DemoValidationContextInput,
): DemoValidationContext {
  const checks = [
    buildCheck("journey","Executive journey","Validate complete executive journey.","journey",input.executiveJourneyPassed ?? true,"critical"),
    buildCheck("presentation","Presentation","Validate executive presentation.","presentation",input.presentationPassed ?? true),
    buildCheck("navigation","Navigation","Validate navigation flow.","navigation",input.navigationPassed ?? true),
    buildCheck("data","Enterprise data","Validate enterprise data.","data",input.dataPassed ?? false,"critical"),
    buildCheck("performance","Performance","Validate demo responsiveness.","performance",input.performancePassed ?? false),
    buildCheck("ui","UI","Validate visual interface.","ui",input.uiPassed ?? false),
    buildCheck("business-value","Business value","Validate customer value proposition.","business-value",input.businessValuePassed ?? false),
    buildCheck("executive-experience","Executive experience","Validate executive presentation experience.","executive-experience",input.executiveExperiencePassed ?? false,"critical"),
  ];

  return {
    organizationId: input.organizationId.trim(),
    companyName: input.companyName.trim(),
    checks,
    contextSummary:
      `${input.companyName} demo validation contains ${
        checks.filter(c => c.status==="passed").length
      }/${checks.length} completed checks.`,
  };
}

export function buildDemoValidationReportInput(
  context: DemoValidationContext,
): DemoValidationReportInput {
  return {
    organizationId: context.organizationId,
    companyName: context.companyName,
    title: `${context.companyName} Demo Validation`,
    checks: context.checks,
    issues: [],
  };
}
