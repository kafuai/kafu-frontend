export interface CustomerGoLiveChecklistItem {
  id: string;
  title: string;
  required: boolean;
  completed: boolean;
}

export const DEFAULT_CUSTOMER_GO_LIVE_CHECKLIST: CustomerGoLiveChecklistItem[] =
  [
    {
      id: "onboarding-completed",
      title: "Customer onboarding completed",
      required: true,
      completed: false,
    },
    {
      id: "activation-completed",
      title: "Customer activation completed",
      required: true,
      completed: false,
    },
    {
      id: "production-validated",
      title: "Production configuration validated",
      required: true,
      completed: false,
    },
    {
      id: "customer-approved",
      title: "Customer go-live approval received",
      required: true,
      completed: false,
    },
    {
      id: "support-confirmed",
      title: "Go-live support coverage confirmed",
      required: true,
      completed: false,
    },
    {
      id: "rollback-confirmed",
      title: "Rollback plan confirmed",
      required: true,
      completed: false,
    },
  ];

export function isCustomerGoLiveChecklistComplete(
  checklist: CustomerGoLiveChecklistItem[],
): boolean {
  return checklist
    .filter((item) => item.required)
    .every((item) => item.completed);
}
