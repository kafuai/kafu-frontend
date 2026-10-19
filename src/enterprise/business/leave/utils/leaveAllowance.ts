import { LeaveRequest } from "../models/leaveModel";
import { LeaveRequestInput, LeaveType } from "../types/leaveTypes";

type Locale = "ar" | "en";

const DAY_MS = 86_400_000;

const COUNT_PENDING_TOWARD_BALANCE = true;

export function countLeaveDays(startDate: number, endDate: number): number {
  return Math.round((endDate - startDate) / DAY_MS) + 1;
}

export interface LeaveBalance {
  year: number;
  allowance: number;
  approved: number;
  pending: number;  
  used: number;    
  remaining: number;
}

export function calculateLeaveBalance(params: {
  type: LeaveType;
  year: number;
  allowance: number;
  existing: readonly LeaveRequest[];
  excludeRequestId?: string; 
}): LeaveBalance {
  let approved = 0;
  let pending = 0;

  for (const leave of params.existing) {
    if (leave.type !== params.type) continue;
    if (leave.id === params.excludeRequestId) continue;
    if (new Date(leave.startDate).getUTCFullYear() !== params.year) continue;

    const days = countLeaveDays(leave.startDate, leave.endDate);

    if (leave.status === "approved") approved += days;
    else if (leave.status === "pending") pending += days;
  }

  const used = COUNT_PENDING_TOWARD_BALANCE ? approved + pending : approved;

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
): LeaveAllowanceEvaluation {
  const year = new Date(input.startDate).getUTCFullYear();

  const balance = calculateLeaveBalance({
    type: input.type,
    year,
    allowance,
    existing,
  });

  const { used, remaining } = balance;
  const requested = countLeaveDays(input.startDate, input.endDate);

  if (requested <= remaining) {
    return { allowed: true, allowance, used, requested, remaining };
  }

  const message =
    locale === "en"
      ? `You requested ${requested} day(s), but your remaining leave balance for ${year} is ${remaining} day(s) (allowance: ${allowance}, already used or pending: ${used}).`
      : `طلبت ${requested} يوم، لكن رصيد إجازتك المتبقي لسنة ${year} هو ${remaining} يوم (المسموح: ${allowance}، المستخدم أو المعلّق: ${used}).`;

  return { allowed: false, allowance, used, requested, remaining, message };
}