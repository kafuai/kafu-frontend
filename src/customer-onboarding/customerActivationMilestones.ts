export type CustomerActivationMilestoneStatus =
  | "pending"
  | "in-progress"
  | "completed"
  | "blocked";

export interface CustomerActivationMilestone {
  id: string;
  title: string;
  status: CustomerActivationMilestoneStatus;
  owner: string;
  targetDate?: string;
}

export const DEFAULT_CUSTOMER_ACTIVATION_MILESTONES: CustomerActivationMilestone[] =
  [
    {
      id: "workspace-activation",
      title: "Activate customer workspace",
      status: "pending",
      owner: "Customer Success",
    },
    {
      id: "user-activation",
      title: "Activate customer users",
      status: "pending",
      owner: "Customer Success",
    },
    {
      id: "configuration-validation",
      title: "Validate organization configuration",
      status: "pending",
      owner: "Implementation",
    },
    {
      id: "training-completion",
      title: "Complete customer training",
      status: "pending",
      owner: "Customer Success",
    },
    {
      id: "go-live-approval",
      title: "Receive go-live approval",
      status: "pending",
      owner: "Executive Sponsor",
    },
  ];
