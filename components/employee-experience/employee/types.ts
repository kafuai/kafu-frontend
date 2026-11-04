export type MessageType = "assistant" | "user";
export type RequestType = "inquiry" | "request";

export type RequestCategory =
  | "leave"
  | "employment_letter"
  | "employee_inquiry"
  | "data_update"
  | "general";

export type SickFormState = "open" | "submitted" | "cancelled";

export type ChatMessage = {
  id: string;
  type: MessageType;
  content: string;
  category?: RequestCategory;
  requestType?: RequestType;
  time: string;
  sickForm?: SickFormState;
};

export type HRRequestStatus = "pending" | "approved" | "rejected";

export type HRRequest = {
  id: string;
  category: RequestCategory;
  status: HRRequestStatus;
  createdAt: number;
  reviewedByName: string | null;
  reviewedAt: number | null;
  startDate: number | null;
  endDate: number | null;
  leaveType?: string | null;
};

export type LeaveBalance = {
  year: number;
  allowance: number;
  approved: number;
  pending: number;
  used: number;
  remaining: number;
};