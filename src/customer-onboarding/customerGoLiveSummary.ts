import { CustomerGoLiveChecklistItem } from "./customerGoLiveChecklist";
import { CustomerGoLivePlan } from "./customerGoLivePlan";
import { CustomerGoLiveReadinessResult } from "./customerGoLiveReadiness";

export interface CustomerGoLiveSummary {
  organizationId: string;
  goLiveOwner: string;
  targetGoLiveDate: string;
  readinessScore: number;
  readyForGoLive: boolean;
  completedChecklistItems: number;
  totalChecklistItems: number;
  blockerCount: number;
}

export function buildCustomerGoLiveSummary(
  plan: CustomerGoLivePlan,
  readiness: CustomerGoLiveReadinessResult,
  checklist: CustomerGoLiveChecklistItem[],
): CustomerGoLiveSummary {
  return {
    organizationId: plan.organizationId,
    goLiveOwner: plan.goLiveOwner,
    targetGoLiveDate: plan.targetGoLiveDate,
    readinessScore: readiness.readinessScore,
    readyForGoLive: readiness.readyForGoLive,
    completedChecklistItems: checklist.filter((item) => item.completed).length,
    totalChecklistItems: checklist.length,
    blockerCount: readiness.blockers.length,
  };
}
