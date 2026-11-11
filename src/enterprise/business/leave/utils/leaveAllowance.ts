import { LeaveRequest } from "../models/leaveModel";
import { LeaveRequestInput, LeaveType } from "../types/leaveTypes";
import { toDateKey } from "./leaveValidator";

type Locale = "ar" | "en";

const DAY_MS = 86_400_000;

function dateKeyToUtc(key: string): number {
  const [y, m, d] = key.split("-").map(Number);
  return Date.UTC(y, m - 1, d);
}

/**
 * Inclusive day count. Without `workingDays` every calendar day counts (legacy behavior).
 * With `workingDays` (0 = Sunday ... 6 = Saturday) only those weekdays are counted.
 * Must stay identical to the SQL function approve_leave_request_with_usage.
 */
export function countLeaveDays(
  startDate: number,
  endDate: number,
  workingDays?: readonly number[],
): number {
  if (!workingDays) return Math.round((endDate - startDate) / DAY_MS) + 1;

  const allowed = new Set(workingDays);
  const last = dateKeyToUtc(toDateKey(endDate));
  let count = 0;
  for (let cursor = dateKeyToUtc(toDateKey(startDate)); cursor <= last; cursor += DAY_MS) {
    if (allowed.has(new Date(cursor).getUTCDay())) count++;
  }
  return count;
}

export interface LeaveBalance {
  year: number;
  allowance: number;
  approved: number;
  pending: number;  
  used: number;    
  remaining: number;
}

export interface PreviousLeaveUsage {
  days: number;
}

export function calculateLeaveBalance(params: {
  type: LeaveType;
  year: number;
  allowance: number;
  existing: readonly LeaveRequest[];
  previousUsage?: PreviousLeaveUsage | null;
  excludeRequestId?: string;
  workingDays?: readonly number[];
}): LeaveBalance {
  let pending = 0;

  for (const leave of params.existing) {
    if (leave.type !== params.type || leave.id === params.excludeRequestId) continue;
    if (new Date(leave.startDate).getUTCFullYear() !== params.year) continue;
    if (leave.status === "pending") {
      pending += countLeaveDays(leave.startDate, leave.endDate, params.workingDays);
    }
  }

  // employee_leave_usage is the sole source of cumulative usage.
  const approved = params.previousUsage?.days ?? 0;
  const used = approved;

  return {
    year: params.year,
    allowance: params.allowance,
    approved,
    pending,
    used,
    remaining: Math.max(params.allowance - used, 0),
  };
}

export interface LeaveAllowanceEvaluation {
  allowed: boolean;
  allowance: number;
  used: number;
  requested: number;
  remaining: number;
  message?: string;
}

export function evaluateLeaveAllowance(
  input: Pick<LeaveRequestInput, "type" | "startDate" | "endDate">,
  allowance: number,
  existing: readonly LeaveRequest[],
  locale: Locale = "en",
  previousUsage?: PreviousLeaveUsage | null,
  workingDays?: readonly number[],
): LeaveAllowanceEvaluation {
  const year = new Date(input.startDate).getUTCFullYear();

  const balance = calculateLeaveBalance({
    type: input.type,
    year,
    allowance,
    existing,
    previousUsage,
    workingDays,
  });

  const { used, remaining } = balance;
  const requested = countLeaveDays(input.startDate, input.endDate, workingDays);

  if (requested <= remaining) {
    return { allowed: true, allowance, used, requested, remaining };
  }

  const message =
    locale === "en"
      ? `You requested ${requested} day(s), but your remaining leave balance for ${year} is ${remaining} day(s) (allowance: ${allowance}, already used: ${used}).`
      : `طلبت ${requested} يوم، لكن رصيد إجازتك المتبقي لسنة ${year} هو ${remaining} يوم (المسموح: ${allowance}، المستخدم: ${used}).`;

  return { allowed: false, allowance, used, requested, remaining, message };
}