export type GoToMarketLaunchMilestoneStatus =
  | "pending"
  | "in-progress"
  | "completed"
  | "blocked";

export interface GoToMarketLaunchMilestone {
  id: string;
  title: string;
  owner: string;
  status: GoToMarketLaunchMilestoneStatus;
  targetDate?: string;
}

export const DEFAULT_GO_TO_MARKET_LAUNCH_MILESTONES: GoToMarketLaunchMilestone[] =
  [
    {
      id: "commercial-assets-approved",
      title: "Approve commercial assets",
      owner: "Commercial",
      status: "pending",
    },
    {
      id: "sales-team-enabled",
      title: "Enable sales team",
      owner: "Sales",
      status: "pending",
    },
    {
      id: "pilot-pipeline-prepared",
      title: "Prepare pilot customer pipeline",
      owner: "Business Development",
      status: "pending",
    },
    {
      id: "launch-communications-ready",
      title: "Prepare launch communications",
      owner: "Marketing",
      status: "pending",
    },
    {
      id: "launch-approval-received",
      title: "Receive executive launch approval",
      owner: "Executive Sponsor",
      status: "pending",
    },
  ];
