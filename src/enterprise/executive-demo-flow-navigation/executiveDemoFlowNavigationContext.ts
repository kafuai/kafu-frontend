import {
  ExecutiveDemoFlowNavigationStep,
  ExecutiveDemoFlowNavigationStepType,
} from "./executiveDemoFlowNavigationTypes";

export interface ExecutiveDemoFlowNavigationContextInput {
  organizationId: string;
  companyName: string;
  industry?: string | null;
  country?: string | null;
  executiveAudience?: string | null;
  demoObjective?: string | null;
  availableMinutes?: number | null;
  includeDiscovery?: boolean;
  includeDecisionBriefing?: boolean;
  includeExecutionReadiness?: boolean;
}

export interface ExecutiveDemoFlowNavigationContext {
  organizationId: string;
  companyName: string;
  audience: string;
  objective: string;
  availableMinutes: number;
  enabledStepTypes: ExecutiveDemoFlowNavigationStepType[];
  recommendedSteps: ExecutiveDemoFlowNavigationStep[];
  contextSummary: string;
}

function resolveEnabledStepTypes(
  input: ExecutiveDemoFlowNavigationContextInput,
): ExecutiveDemoFlowNavigationStepType[] {
  const stepTypes: ExecutiveDemoFlowNavigationStepType[] = [
    "opening",
    "context",
  ];

  if (input.includeDiscovery ?? true) {
    stepTypes.push("discovery");
  }

  stepTypes.push("analysis");

  if (input.includeDecisionBriefing ?? true) {
    stepTypes.push("decision", "recommendation");
  }

  if (input.includeExecutionReadiness ?? true) {
    stepTypes.push("execution");
  }

  stepTypes.push("closing");

  return stepTypes;
}

function routeForStepType(
  type: ExecutiveDemoFlowNavigationStepType,
): string {
  switch (type) {
    case "opening":
      return "/welcome";
    case "context":
      return "/company-profile";
    case "discovery":
      return "/discovery";
    case "analysis":
      return "/command-center";
    case "decision":
      return "/executive-summary";
    case "recommendation":
      return "/workspace/executive-report";
    case "execution":
      return "/company-workspace";
    case "closing":
      return "/dashboard";
  }
}

function buildRecommendedSteps(
  stepTypes: ExecutiveDemoFlowNavigationStepType[],
  availableMinutes: number,
): ExecutiveDemoFlowNavigationStep[] {
  const estimatedMinutesPerStep =
    stepTypes.length > 0
      ? Math.max(1, Math.floor(availableMinutes / stepTypes.length))
      : 1;

  return stepTypes.map((type, index) => ({
    id: `executive-demo-step-${type}`,
    order: index + 1,
    title: type
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" "),
    description: `Present the ${type} stage of the executive demo.`,
    type,
    route: {
      id: `route-${type}`,
      path: routeForStepType(type),
      label: `${type} screen`,
    },
    required:
      type === "opening" ||
      type === "analysis" ||
      type === "closing",
    estimatedMinutes: estimatedMinutesPerStep,
  }));
}

export function buildExecutiveDemoFlowNavigationContext(
  input: ExecutiveDemoFlowNavigationContextInput,
): ExecutiveDemoFlowNavigationContext {
  const audience =
    input.executiveAudience?.trim() || "Executive leadership team";

  const objective =
    input.demoObjective?.trim() ||
    "Demonstrate the KAFU AI enterprise transformation journey";

  const availableMinutes = Math.max(input.availableMinutes ?? 30, 10);
  const enabledStepTypes = resolveEnabledStepTypes(input);
  const recommendedSteps = buildRecommendedSteps(
    enabledStepTypes,
    availableMinutes,
  );

  return {
    organizationId: input.organizationId.trim(),
    companyName: input.companyName.trim(),
    audience,
    objective,
    availableMinutes,
    enabledStepTypes,
    recommendedSteps,
    contextSummary:
      `${input.companyName.trim()} executive demo is designed for ${audience} ` +
      `with a ${availableMinutes}-minute session focused on ${objective}.`,
  };
}
