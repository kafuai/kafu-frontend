import { LeaveRequest } from "../models/leaveModel";
import { LeaveRequestInput } from "../types/leaveTypes";

type Locale = "ar" | "en";

const DAY_MS = 86_400_000;

export function countLeaveDays(startDate: number, endDate: number): number {
  return Math.round((endDate - startDate) / DAY_MS) + 1;
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


  const used = existing
    .filter(
      (leave) =>
        leave.type === input.type &&
        (leave.status === "approved") &&
        new Date(leave.startDate).getUTCFullYear() === year,
    )
    .reduce(
      (sum, leave) => sum + countLeaveDays(leave.startDate, leave.endDate),
      0,
    );

  const requested = countLeaveDays(input.startDate, input.endDate);
  const remaining = Math.max(allowance - used, 0);

  if (requested <= remaining) {
    return { allowed: true, allowance, used, requested, remaining };
  }

  const message =
    locale === "en"
      ? `You requested ${requested} day(s), but your remaining leave balance for ${year} is ${remaining} day(s) (allowance: ${allowance}, already used: ${used}).`
      : `طلبت ${requested} يوم، لكن رصيد إجازتك المتبقي لسنة ${year} هو ${remaining} يوم (المسموح: ${allowance}، المستخدم: ${used}).`;

  return { allowed: false, allowance, used, requested, remaining, message };
}