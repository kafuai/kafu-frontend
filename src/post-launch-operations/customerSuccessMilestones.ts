export type CustomerSuccessMilestoneStatus =
  | "pending"
  | "in-progress"
  | "completed"
  | "blocked";

export interface CustomerSuccessMilestone {
  id: string;
  title: string;
  owner: string;
  status: CustomerSuccessMilestoneStatus;
  targetDate?: string;
}

export const DEFAULT_CUSTOMER_SUCCESS_MILESTONES: CustomerSuccessMilestone[] =
  [
    {
      id: "first-week-review",
      title: "Complete first-week customer review",
      owner: "Customer Success",
      status: "pending",
    },
    {
      id: "adoption-baseline",
      title: "Establish customer adoption baseline",
      owner: "Customer Success",
      status: "pending",
    },
    {
      id: "feedback-review",
      title: "Review initial customer feedback",
      owner: "Product",
      status: "pending",
    },
    {
      id: "open-issues-resolution",
      title: "Resolve priority customer issues",
      owner: "Operations",
      status: "pending",
    },
    {
      id: "success-outcomes-review",
      title: "Review initial customer success outcomes",
      owner: "Executive Sponsor",
      status: "pending",
    },
  ];
