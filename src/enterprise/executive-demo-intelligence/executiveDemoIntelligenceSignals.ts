import type {
  ExecutiveDemoIntelligenceContext,
  ExecutiveDemoIntelligencePriority,
  ExecutiveDemoIntelligenceSignal,
  ExecutiveDemoIntelligenceSignalType,
} from "./executiveDemoIntelligenceTypes";

export interface CreateExecutiveDemoSignalInput {
  id: string;
  type: ExecutiveDemoIntelligenceSignalType;
  title: string;
  description: string;
  score: number;
  priority: ExecutiveDemoIntelligencePriority;
  source: string;
  evidence?: string[];
  detectedAt?: string;
}

function normalizeSignalScore(score: number): number {
  return Math.min(100, Math.max(0, Math.round(score)));
}

export function createExecutiveDemoIntelligenceSignal(
  input: CreateExecutiveDemoSignalInput,
): ExecutiveDemoIntelligenceSignal {
  return {
    id: input.id.trim(),
    type: input.type,
    title: input.title.trim(),
    description: input.description.trim(),
    score: normalizeSignalScore(input.score),
    priority: input.priority,
    source: input.source.trim(),
    detectedAt: input.detectedAt ?? new Date().toISOString(),
    evidence: Array.from(
      new Set(
        (input.evidence ?? [])
          .map((item) => item.trim())
          .filter(Boolean),
      ),
    ),
  };
}

export function deriveExecutiveDemoIntelligenceSignals(
  context: ExecutiveDemoIntelligenceContext,
): ExecutiveDemoIntelligenceSignal[] {
  const signals: ExecutiveDemoIntelligenceSignal[] = [];
  const timestamp = new Date().toISOString();

  if (context.readinessScore !== undefined) {
    const priority: ExecutiveDemoIntelligencePriority =
      context.readinessScore < 40
        ? "critical"
        : context.readinessScore < 60
          ? "high"
          : context.readinessScore < 80
            ? "medium"
            : "low";

    signals.push(
      createExecutiveDemoIntelligenceSignal({
        id: `${context.sessionId}-readiness`,
        type: "readiness",
        title: "Enterprise AI readiness",
        description: `Current readiness score is ${context.readinessScore} out of 100.`,
        score: context.readinessScore,
        priority,
        source: "executive-demo-context",
        evidence: [`Readiness score: ${context.readinessScore}`],
        detectedAt: timestamp,
      }),
    );
  }

  if ((context.overdueLeads ?? 0) > 0) {
    const overdueLeads = context.overdueLeads ?? 0;

    signals.push(
      createExecutiveDemoIntelligenceSignal({
        id: `${context.sessionId}-overdue-leads`,
        type: "risk",
        title: "Commercial execution risk",
        description: `${overdueLeads} overdue leads require executive attention.`,
        score: Math.min(100, overdueLeads * 10),
        priority: overdueLeads >= 10 ? "critical" : "high",
        source: "executive-demo-context",
        evidence: [`Overdue leads: ${overdueLeads}`],
        detectedAt: timestamp,
      }),
    );
  }

  if ((context.discoveryAnswersCount ?? 0) < 5) {
    signals.push(
      createExecutiveDemoIntelligenceSignal({
        id: `${context.sessionId}-discovery-depth`,
        type: "engagement",
        title: "Limited discovery depth",
        description:
          "The current discovery evidence may be insufficient for a high-confidence executive recommendation.",
        score: Math.max(0, (context.discoveryAnswersCount ?? 0) * 20),
        priority: "medium",
        source: "executive-demo-context",
        evidence: [
          `Discovery answers: ${context.discoveryAnswersCount ?? 0}`,
        ],
        detectedAt: timestamp,
      }),
    );
  }

  if ((context.activeModules?.length ?? 0) > 0) {
    signals.push(
      createExecutiveDemoIntelligenceSignal({
        id: `${context.sessionId}-active-modules`,
        type: "opportunity",
        title: "Demonstrable enterprise coverage",
        description: `${context.activeModules?.length ?? 0} active modules can be used to demonstrate connected enterprise value.`,
        score: Math.min(100, (context.activeModules?.length ?? 0) * 15),
        priority: "medium",
        source: "executive-demo-context",
        evidence: context.activeModules ?? [],
        detectedAt: timestamp,
      }),
    );
  }

  return signals;
}

export function rankExecutiveDemoIntelligenceSignals(
  signals: ExecutiveDemoIntelligenceSignal[],
): ExecutiveDemoIntelligenceSignal[] {
  const priorityWeight: Record<
    ExecutiveDemoIntelligencePriority,
    number
  > = {
    critical: 4,
    high: 3,
    medium: 2,
    low: 1,
  };

  return [...signals].sort((left, right) => {
    const priorityDifference =
      priorityWeight[right.priority] - priorityWeight[left.priority];

    if (priorityDifference !== 0) {
      return priorityDifference;
    }

    return right.score - left.score;
  });
}
