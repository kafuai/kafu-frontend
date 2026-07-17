export interface ExecutiveDemoRehearsalItem {
  id: string;
  title: string;
  required: boolean;
  completed: boolean;
  verification: string;
}

export const EXECUTIVE_DEMO_REHEARSAL_CHECKLIST: readonly ExecutiveDemoRehearsalItem[] =
  [
    {
      id: "demo-environment",
      title: "Demo environment opens without errors",
      required: true,
      completed: false,
      verification:
        "Open every page used during the demo in presentation order.",
    },
    {
      id: "demo-data",
      title: "Demo data is complete and credible",
      required: true,
      completed: false,
      verification:
        "Confirm that names, scores, statuses, dates, and recommendations are consistent.",
    },
    {
      id: "demo-navigation",
      title: "Navigation follows the approved sequence",
      required: true,
      completed: false,
      verification:
        "Complete the full demo without searching for pages or using developer routes.",
    },
    {
      id: "demo-timing",
      title: "Demo duration is between 15 and 20 minutes",
      required: true,
      completed: false,
      verification:
        "Run two timed rehearsals and record the final duration.",
    },
    {
      id: "demo-narrative",
      title: "Narrative is business-led and concise",
      required: true,
      completed: false,
      verification:
        "Ensure every product screen supports a business point.",
    },
    {
      id: "demo-visuals",
      title: "Critical pages pass visual review",
      required: true,
      completed: false,
      verification:
        "Check spacing, typography, alignment, overflow, and Arabic rendering.",
    },
    {
      id: "demo-responsive",
      title: "Presentation screen resolution is verified",
      required: true,
      completed: false,
      verification:
        "Test the exact laptop, browser zoom, and display resolution used in the meeting.",
    },
    {
      id: "demo-fallback",
      title: "Fallback plan is prepared",
      required: true,
      completed: false,
      verification:
        "Prepare screenshots or a recorded walkthrough for connectivity or environment failure.",
    },
    {
      id: "demo-questions",
      title: "Expected executive questions are prepared",
      required: true,
      completed: false,
      verification:
        "Prepare concise answers for pricing, security, integration, implementation, and Pilot scope.",
    },
    {
      id: "demo-next-step",
      title: "Closing call-to-action is approved",
      required: true,
      completed: false,
      verification:
        "Define the exact Pilot or Discovery next step requested at the end.",
    },
  ] as const;

export function evaluateExecutiveDemoRehearsal(
  items: readonly ExecutiveDemoRehearsalItem[],
) {
  const requiredItems = items.filter((item) => item.required);
  const completedRequiredItems = requiredItems.filter(
    (item) => item.completed,
  );

  return {
    ready:
      requiredItems.length > 0 &&
      completedRequiredItems.length === requiredItems.length,
    totalItems: items.length,
    requiredItems: requiredItems.length,
    completedRequiredItems: completedRequiredItems.length,
    remainingItems: requiredItems
      .filter((item) => !item.completed)
      .map((item) => item.id),
  };
}
