import type {
  RevenueOwner,
  RevenuePriority,
} from "./revenueOperationsTypes";

export interface RevenueDealDeskRequest {
  id: string;
  opportunityId: string;
  accountName: string;
  owner: RevenueOwner;
  requestedDiscount: number;
  expectedRevenue: number;
  priority: RevenuePriority;
  approved: boolean;
}

export function requiresExecutiveApproval(
  request: RevenueDealDeskRequest,
): boolean {
  return request.requestedDiscount > 20;
}
