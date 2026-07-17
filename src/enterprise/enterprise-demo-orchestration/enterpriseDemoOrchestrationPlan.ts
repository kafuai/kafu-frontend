import {
  EnterpriseDemoOrchestrationInput,
  EnterpriseDemoOrchestrationPlan,
  EnterpriseDemoOrchestrationPriority,
  EnterpriseDemoOrchestrationStep,
} from "./enterpriseDemoOrchestrationTypes";

function createOrchestrationId(
  demoSessionId: string,
  scenarioId: string,
): string {
  const normalizedSessionId = demoSessionId
    .trim()
    .replace(/[^a-zA-Z0-9-_]/g, "-");

  const normalizedScenarioId = scenarioId
    .trim()
    .replace(/[^a-zA-Z0-9-_]/g, "-");

  return `enterprise-demo-orchestration-${normalizedSessionId}-${normalizedScenarioId}`;
}

function resolvePriority(
  input: EnterpriseDemoOrchestrationInput,
): EnterpriseDemoOrchestrationPriority {
  return input.requestedPriority ?? "high";
}

function buildDefaultSteps(): EnterpriseDemoOrchestrationStep[] {
  return [
    {
      id: "initialize-demo-runtime",
      title: "Initialize Demo Runtime",
      description:
        "Prepare the enterprise demo runtime and validate the active session.",
      sequence: 1,
      status: "ready",
      required: true,
      estimatedDurationSeconds: 15,
    },
    {
      id: "prepare-demo-experience",
      title: "Prepare Demo Experience",
      description:
        "Map the selected scenario into the executive demo experience.",
      sequence: 2,
      status: "pending",
      required: true,
      estimatedDurationSeconds: 20,
    },
    {
      id: "prepare-demo-presentation",
      title: "Prepare Demo Presentation",
      description:
        "Build the presentation sequence, narrative, progress and view model.",
      sequence: 3,
      status: "pending",
      required: true,
      estimatedDurationSeconds: 20,
    },
    {
      id: "execute-demo-sequence",
      title: "Execute Demo Sequence",
      description:
        "Coordinate the complete enterprise demo journey in the correct order.",
      sequence: 4,
      status: "pending",
      required: true,
      estimatedDurationSeconds: 120,
    },
    {
      id: "complete-demo-session",
      title: "Complete Demo Session",
      description:
        "Finalize the session, capture completion state and prepare the result.",
      sequence: 5,
      status: "pending",
      required: true,
      estimatedDurationSeconds: 15,
    },
  ];
}

export function buildEnterpriseDemoOrchestrationPlan(
  input: EnterpriseDemoOrchestrationInput,
): EnterpriseDemoOrchestrationPlan {
  const timestamp = new Date().toISOString();

  return {
    id: createOrchestrationId(input.demoSessionId, input.scenarioId),
    organizationId: input.organizationId,
    demoSessionId: input.demoSessionId,
    scenarioId: input.scenarioId,
    title: input.companyName
      ? `${input.companyName} Enterprise Demo`
      : "KAFU AI Enterprise Demo",
    priority: resolvePriority(input),
    status: "ready",
    steps: buildDefaultSteps(),
    currentStepId: "initialize-demo-runtime",
    createdAt: timestamp,
    updatedAt: timestamp,
  };
}
