import { LeaveRequestInput } from "../types/leaveTypes";

export interface LeaveValidationResult {
  valid: boolean;
  errors: string[];
}

export class LeaveValidationError extends Error {
  readonly errors: string[];

  constructor(errors: string[]) {
    super(errors.join(" "));
    this.name = "LeaveValidationError";
    this.errors = errors;
  }
}

const BUSINESS_TIME_ZONE = "Asia/Riyadh";

export function toDateKey(timestamp: number): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: BUSINESS_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(timestamp));
}

/** "YYYY-MM-DD" -> UTC-midnight timestamp (same convention as the agent's extractDates). */
export function parseDateKey(value: string): number | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!m) return null;
  const [y, mo, d] = [Number(m[1]), Number(m[2]), Number(m[3])];
  const date = new Date(Date.UTC(y, mo - 1, d));
  if (
    date.getUTCFullYear() !== y ||
    date.getUTCMonth() !== mo - 1 ||
    date.getUTCDate() !== d
  ) {
    return null;
  }
  return date.getTime();
}

export class LeaveValidator {
  validate(
    input: LeaveRequestInput,
    now: number = Date.now(),
    messageLanguage: "ar" | "en" = "en"
  ): LeaveValidationResult {
    const errors: string[] = [];
    const isAr = messageLanguage === "ar";

    if (!input.employeeId) errors.push(isAr ? "رقم الموظف مطلوب." : "Employee id is required.");
    if (!input.organizationId) errors.push(isAr ? "رقم المنشأة مطلوب." : "Organization id is required.");
    if (!input.type) errors.push(isAr ? "نوع الإجازة مطلوب." : "Leave type is required.");
    if (!input.startDate) errors.push(isAr ? "تاريخ بداية الإجازة مطلوب." : "Leave start date is required.");
    if (!input.endDate) errors.push(isAr ? "تاريخ نهاية الإجازة مطلوب." : "Leave end date is required.");
    if (!input.reason) errors.push(isAr ? "سبب الإجازة مطلوب." : "Leave reason is required.");

    if (input.startDate && input.endDate) {
      if (input.endDate < input.startDate) {
        errors.push(
          isAr 
            ? "لا يمكن أن يكون تاريخ نهاية الإجازة قبل تاريخ البداية." 
            : "The leave end date cannot be before the start date."
        );
      }

      if (toDateKey(input.startDate) < toDateKey(now)) {
        errors.push(
          isAr 
            ? "لا يمكن أن يكون تاريخ بداية الإجازة في الماضي." 
            : "The leave start date cannot be in the past."
        );
      }
    }

    return { valid: errors.length === 0, errors };
  }

  validateRequest(input: LeaveRequestInput, messageLanguage: "ar" | "en" = "en"): boolean {
    return this.validate(input, Date.now(), messageLanguage).valid;
  }
}