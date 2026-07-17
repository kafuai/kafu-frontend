import {
  ExecutiveDemoFinalIntegrationCheckpoint,
  ExecutiveDemoFinalIntegrationComponent,
} from "./executiveDemoFinalIntegrationTypes";

export interface ExecutiveDemoFinalIntegrationContextInput {
  organizationId: string;
  companyName: string;
  operationalReadinessAvailable?: boolean;
  decisionBriefingAvailable?: boolean;
  flowNavigationAvailable?: boolean;
  presentationAvailable?: boolean;
  orchestrationAvailable?: boolean;
  experienceAvailable?: boolean;
}

export interface ExecutiveDemoFinalIntegrationContext {
  organizationId: string;
  companyName: string;
  components: ExecutiveDemoFinalIntegrationComponent[];
  checkpoints: ExecutiveDemoFinalIntegrationCheckpoint[];
  contextSummary: string;
}

function createComponent(
  id: string,
  name: string,
  type: ExecutiveDemoFinalIntegrationComponent["type"],
  available: boolean,
): ExecutiveDemoFinalIntegrationComponent {
  return {
    id,
    name,
    type,
    version: "1.0.0",
    enabled: available,
    required: true,
    health: available ? "healthy" : "critical",
    dependencies: [],
  };
}

export function buildExecutiveDemoFinalIntegrationContext(
  input: ExecutiveDemoFinalIntegrationContextInput,
): ExecutiveDemoFinalIntegrationContext {
  const components: ExecutiveDemoFinalIntegrationComponent[] = [
    createComponent(
      "operational-readiness",
      "Executive Demo Operational Readiness",
      "operational-readiness",
      input.operationalReadinessAvailable ?? true,
    ),
    createComponent(
      "decision-briefing",
      "Executive Demo Decision Briefing",
      "decision-briefing",
      input.decisionBriefingAvailable ?? true,
    ),
    createComponent(
      "flow-navigation",
      "Executive Demo Flow Navigation",
      "flow-navigation",
      input.flowNavigationAvailable ?? true,
    ),
    createComponent(
      "presentation",
      "Executive Demo Presentation",
      "presentation",
      input.presentationAvailable ?? true,
    ),
    createComponent(
      "orchestration",
      "Executive Demo Orchestration",
      "orchestration",
      input.orchestrationAvailable ?? true,
    ),
    createComponent(
      "experience",
      "Executive Demo Experience",
      "experience",
      input.experienceAvailable ?? true,
    ),
  ];

  const checkpoints: ExecutiveDemoFinalIntegrationCheckpoint[] = [
    {
      id: "checkpoint-components",
      title: "Required components available",
      description:
        "Confirm that all required executive demo components are enabled.",
      passed: components.every((component) => component.enabled),
      required: true,
    },
    {
      id: "checkpoint-health",
      title: "Component health validated",
      description:
        "Confirm that all required components report healthy status.",
      passed: components.every(
        (component) => component.health === "healthy",
      ),
      required: true,
    },
    {
      id: "checkpoint-navigation",
      title: "End-to-end navigation validated",
      description:
        "Confirm that the executive demo journey can run from opening to closing.",
      passed: input.flowNavigationAvailable ?? true,
      required: true,
    },
    {
      id: "checkpoint-decision",
      title: "Decision briefing connected",
      description:
        "Confirm that the executive decision briefing is available in the demo journey.",
      passed: input.decisionBriefingAvailable ?? true,
      required: true,
    },
  ];

  const availableComponents = components.filter(
    (component) => component.enabled,
  ).length;

  return {
    organizationId: input.organizationId.trim(),
    companyName: input.companyName.trim(),
    components,
    checkpoints,
    contextSummary:
      `${input.companyName.trim()} executive demo final integration includes ` +
      `${availableComponents} of ${components.length} required components.`,
  };
}
