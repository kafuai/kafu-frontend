export type PartnerMdfRequestStatus =
  | "draft"
  | "submitted"
  | "approved"
  | "rejected"
  | "reimbursed";

export interface PartnerMdfRequest {
  id: string;
  partnerId: string;
  campaignName: string;
  requestedAmount: number;
  approvedAmount?: number;
  status: PartnerMdfRequestStatus;
}

export function approveMdfRequest(
  request: PartnerMdfRequest,
  approvedAmount: number,
): PartnerMdfRequest {
  return {
    ...request,
    approvedAmount,
    status: "approved",
  };
}
