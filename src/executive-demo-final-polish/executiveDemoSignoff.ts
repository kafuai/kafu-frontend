import {
  validateExecutiveDemo,
} from "./executiveDemoFinalPolishValidator";
import {
  EXECUTIVE_DEMO_REHEARSAL_CHECKLIST,
  evaluateExecutiveDemoRehearsal,
} from "./executiveDemoRehearsalChecklist";

export interface ExecutiveDemoSignoff {
  structurallyReady: boolean;
  rehearsalReady: boolean;
  approved: boolean;
  totalMinutes: number;
  blockers: string[];
  nextAction: string;
}

export function buildExecutiveDemoSignoff(): ExecutiveDemoSignoff {
  const structuralValidation = validateExecutiveDemo();
  const rehearsalValidation = evaluateExecutiveDemoRehearsal(
    EXECUTIVE_DEMO_REHEARSAL_CHECKLIST,
  );

  const blockers = [
    ...structuralValidation.missingCriticalStages.map(
      (stage) => `Missing demo stage: ${stage}`,
    ),
    ...rehearsalValidation.remainingItems.map(
      (item) => `Rehearsal item pending: ${item}`,
    ),
  ];

  const approved =
    structuralValidation.ready &&
    rehearsalValidation.ready &&
    blockers.length === 0;

  return {
    structurallyReady: structuralValidation.ready,
    rehearsalReady: rehearsalValidation.ready,
    approved,
    totalMinutes: structuralValidation.totalMinutes,
    blockers,
    nextAction: approved
      ? "Approve the executive demo for customer and investor presentations."
      : "Complete the remaining rehearsal and visual validation items.",
  };
}
