export interface PostLaunchChecklistItem {
  id: string;
  title: string;
  required: boolean;
  completed: boolean;
}

export const DEFAULT_POST_LAUNCH_CHECKLIST: PostLaunchChecklistItem[] = [
  {
    id: "production-health-confirmed",
    title: "Production health confirmed",
    required: true,
    completed: false,
  },
  {
    id: "customer-access-validated",
    title: "Customer access validated",
    required: true,
    completed: false,
  },
  {
    id: "support-channel-confirmed",
    title: "Customer support channel confirmed",
    required: true,
    completed: false,
  },
  {
    id: "customer-feedback-collected",
    title: "Initial customer feedback collected",
    required: true,
    completed: false,
  },
  {
    id: "success-review-scheduled",
    title: "Customer success review scheduled",
    required: true,
    completed: false,
  },
  {
    id: "open-issues-assigned",
    title: "Open issues assigned",
    required: true,
    completed: false,
  },
];

export function isPostLaunchChecklistComplete(
  checklist: PostLaunchChecklistItem[],
): boolean {
  return checklist
    .filter((item) => item.required)
    .every((item) => item.completed);
}
