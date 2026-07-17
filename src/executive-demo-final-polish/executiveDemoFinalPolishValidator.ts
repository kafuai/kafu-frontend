import {
  EXECUTIVE_DEMO_AGENDA,
} from "./executiveDemoNarrative";
import {
  EXECUTIVE_DEMO_FLOW,
} from "./executiveDemoFlow";
import type {
  ExecutiveDemoStage,
  ExecutiveDemoValidationResult,
} from "./executiveDemoFinalPolishTypes";

const REQUIRED_CRITICAL_STAGES: readonly ExecutiveDemoStage[] = [
  "opening",
  "problem",
  "discovery",
  "assessment",
  "intelligence",
  "recommendation",
  "executive-summary",
  "command-center",
  "digital-workforce",
  "closing",
];

export function validateExecutiveDemo(): ExecutiveDemoValidationResult {
  const stageSet = new Set(
    EXECUTIVE_DEMO_AGENDA.checkpoints.map(
      (checkpoint) => checkpoint.stage,
    ),
  );

  const missingCriticalStages = REQUIRED_CRITICAL_STAGES.filter(
    (stage) => !stageSet.has(stage),
  );

  const calculatedMinutes =
    EXECUTIVE_DEMO_AGENDA.checkpoints.reduce(
      (total, checkpoint) =>
        total + checkpoint.estimatedMinutes,
      0,
    );

  const recommendations: string[] = [];

  if (calculatedMinutes < 15) {
    recommendations.push(
      "Expand the strategic narrative or live product walkthrough to reach at least 15 minutes.",
    );
  }

  if (calculatedMinutes > 20) {
    recommendations.push(
      "Reduce lower-priority sections to keep the executive demo within 20 minutes.",
    );
  }

  if (missingCriticalStages.length > 0) {
    recommendations.push(
      "Add every missing critical stage before approving the demo.",
    );
  }

  if (
    EXECUTIVE_DEMO_FLOW.length <
    REQUIRED_CRITICAL_STAGES.length - 1
  ) {
    recommendations.push(
      "Complete the narrative transitions between all critical demo stages.",
    );
  }

  if (
    recommendations.length === 0 &&
    calculatedMinutes >= 15 &&
    calculatedMinutes <= 20
  ) {
    recommendations.push(
      "The executive demo is structurally ready for rehearsal and final visual validation.",
    );
  }

  return {
    ready:
      calculatedMinutes >= 15 &&
      calculatedMinutes <= 20 &&
      missingCriticalStages.length === 0 &&
      EXECUTIVE_DEMO_FLOW.length >=
        REQUIRED_CRITICAL_STAGES.length - 1,
    totalMinutes: calculatedMinutes,
    stages: stageSet.size,
    missingCriticalStages,
    recommendations,
  };
}
