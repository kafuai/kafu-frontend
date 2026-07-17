export interface GoToMarketChecklistItem {
  id: string;
  title: string;
  required: boolean;
  completed: boolean;
}

export const DEFAULT_GO_TO_MARKET_CHECKLIST: GoToMarketChecklistItem[] = [
  {
    id: "target-market-confirmed",
    title: "Target market confirmed",
    required: true,
    completed: false,
  },
  {
    id: "segments-confirmed",
    title: "Target customer segments confirmed",
    required: true,
    completed: false,
  },
  {
    id: "value-proposition-approved",
    title: "Value proposition approved",
    required: true,
    completed: false,
  },
  {
    id: "sales-assets-approved",
    title: "Sales assets approved",
    required: true,
    completed: false,
  },
  {
    id: "pilot-offer-ready",
    title: "Pilot offer ready",
    required: true,
    completed: false,
  },
  {
    id: "launch-owner-assigned",
    title: "Launch owner assigned",
    required: true,
    completed: false,
  },
];

export function isGoToMarketChecklistComplete(
  checklist: GoToMarketChecklistItem[],
): boolean {
  return checklist
    .filter((item) => item.required)
    .every((item) => item.completed);
}
