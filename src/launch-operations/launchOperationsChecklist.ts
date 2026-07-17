export interface LaunchOperationsChecklistItem {
  id: string;
  title: string;
  required: boolean;
  completed: boolean;
}

export const DEFAULT_LAUNCH_OPERATIONS_CHECKLIST: LaunchOperationsChecklistItem[] =
  [
    {
      id: "release-confirmed",
      title: "Release candidate confirmed",
      required: true,
      completed: false,
    },
    {
      id: "deployment-confirmed",
      title: "Production deployment confirmed",
      required: true,
      completed: false,
    },
    {
      id: "support-team-ready",
      title: "Launch support team ready",
      required: true,
      completed: false,
    },
    {
      id: "monitoring-ready",
      title: "Production monitoring ready",
      required: true,
      completed: false,
    },
    {
      id: "escalation-path-confirmed",
      title: "Escalation path confirmed",
      required: true,
      completed: false,
    },
    {
      id: "customer-communications-ready",
      title: "Customer communications ready",
      required: true,
      completed: false,
    },
  ];

export function isLaunchOperationsChecklistComplete(
  checklist: LaunchOperationsChecklistItem[],
): boolean {
  return checklist
    .filter((item) => item.required)
    .every((item) => item.completed);
}
