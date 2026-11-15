export type RequestStatus = "pending" | "approved" | "rejected" | "cancelled";
export type RequestSource = "employee_requests" | "attendance_corrections";
export type RequestGroup = "leave" | "letter" | "attendance";

export type CorrectionType =
  | "missed_check_in"
  | "missed_check_out"
  | "time_change"
  | "dispute_late"
  | "dispute_absence"
  | "excuse";

export const CORRECTION_TIME_TYPES: CorrectionType[] = [
  "missed_check_in",
  "missed_check_out",
  "time_change",
];

export type LeaveBalanceInfo = {
  year: number;
  allowance: number;
  approved: number;
  pending: number;
  used: number;
  remaining: number;
  requested: number;
  remainingAfter: number;
};

type Base = {
  /** Unique across sources: `${source}:${id}` */
  key: string;
  /** Original id in its own table (used for API calls). */
  id: string;
  source: RequestSource;
  status: RequestStatus;
  employeeId: string;
  employeeName: string;
  createdAt: number;
  reason: string;
  reviewedByName: string | null;
};

export type LeaveItem = Base & {
  group: "leave";
  source: "employee_requests";
  leaveType: string | null;
  startDate: number | null;
  endDate: number | null;
  leaveBalance: LeaveBalanceInfo | null;
};

export type LetterItem = Base & {
  group: "letter";
  source: "employee_requests";
};

export type TimePair = { checkIn?: string | null; checkOut?: string | null };

export type CorrectionItem = Base & {
  group: "attendance";
  source: "attendance_corrections";
  correctionType: CorrectionType;
  workDate: string;
  original: TimePair | null;
  proposed: TimePair | null;
  decisionNote: string | null;
};

export type UnifiedRequest = LeaveItem | LetterItem | CorrectionItem;