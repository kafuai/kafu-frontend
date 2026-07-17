import type {
  ExecutiveDemoIntelligenceContext,
  ExecutiveDemoIntelligenceObjective,
  ExecutiveDemoIntelligencePriority,
} from "./executiveDemoIntelligenceTypes";

export interface CreateExecutiveDemoObjectiveInput {
  id: string;
  type: ExecutiveDemoIntelligenceObjective["type"];
  title: string;
  description: string;
  priority?: ExecutiveDemoIntelligencePriority;
  successCriteria?: string[];
}

export function createExecutiveDemoIntelligenceObjective(
  input: CreateExecutiveDemoObjectiveInput,
): ExecutiveDemoIntelligenceObjective {
  return {
    id: input.id.trim(),
    type: input.type,
    title: input.title.trim(),
    description: input.description.trim(),
    priority: input.priority ?? "medium",
    successCriteria: Array.from(
      new Set(
        (input.successCriteria ?? [])
          .map((criterion) => criterion.trim())
          .filter(Boolean),
      ),
    ),
  };
}

export function buildDefaultExecutiveDemoObjectives(
  context: ExecutiveDemoIntelligenceContext,
): ExecutiveDemoIntelligenceObjective[] {
  const objectives: ExecutiveDemoIntelligenceObjective[] = [
    createExecutiveDemoIntelligenceObjective({
      id: `${context.sessionId}-demonstrate-value`,
      type: "demonstrate-value",
      title: "Demonstrate connected enterprise value",
      description:
        "Show how KAFU AI converts fragmented enterprise information into executive intelligence and coordinated action.",
      priority: "high",
      successCriteria: [
        "Executive understands the connected product journey",
        "Value is linked to the organization context",
        "The demonstration produces a clear next step",
      ],
    }),
    createExecutiveDemoIntelligenceObjective({
      id: `${context.sessionId}-accelerate-decision`,
      type: "accelerate-decision",
      title: "Accelerate executive decision-making",
      description:
        "Present the most important signal, recommendation and action without unnecessary complexity.",
      priority: "high",
      successCriteria: [
        "Primary decision is clearly identified",
        "Recommendation includes supporting evidence",
        "Executive action can be initiated immediately",
      ],
    }),
    createExecutiveDemoIntelligenceObjective({
      id: `${context.sessionId}-build-confidence`,
      type: "build-confidence",
      title: "Build confidence in enterprise intelligence",
      description:
        "Demonstrate that recommendations are grounded in organizational context, evidence and measurable signals.",
      priority: "medium",
      successCriteria: [
        "Confidence level is visible",
        "Supporting signals are traceable",
        "Unknown or incomplete evidence is acknowledged",
      ],
    }),
  ];

  if (
    (context.overdueLeads ?? 0) > 0 ||
    (context.readinessScore !== undefined && context.readinessScore < 60)
  ) {
    objectives.push(
      createExecutiveDemoIntelligenceObjective({
        id: `${context.sessionId}-expose-risk`,
        type: "expose-risk",
        title: "Expose immediate enterprise risk",
        description:
          "Surface the highest-priority execution or readiness risk requiring executive attention.",
        priority: "critical",
        successCriteria: [
          "Risk is quantified",
          "Business impact is explained",
          "Recommended intervention is presented",
        ],
      }),
    );
  }

  return objectives;
}

export function rankExecutiveDemoIntelligenceObjectives(
  objectives: ExecutiveDemoIntelligenceObjective[],
): ExecutiveDemoIntelligenceObjective[] {
  const priorityWeight: Record<
    ExecutiveDemoIntelligencePriority,
    number
  > = {
    critical: 4,
    high: 3,
    medium: 2,
    low: 1,
  };

  return [...objectives].sort(
    (left, right) =>
      priorityWeight[right.priority] - priorityWeight[left.priority],
  );
}
