/**
 * Payroll calculation engine (pure functions, no I/O).
 */

/** Employee share of GOSI for Saudi nationals (9% annuities + 0.75% SANED). */
export const GOSI_SAUDI_RATE = 0.0975;

/**
 * GOSI contribution base cap (SAR). Set to Number.POSITIVE_INFINITY
 * if your company does not want the cap applied.
 */
export const GOSI_MAX_BASE = 45_000;

/** Daily wage = monthly wage / 30 (regardless of the calendar month length). */
export const WAGE_DAYS_PER_MONTH = 30;

const round2 = (value: number): number =>
  Math.round((value + Number.EPSILON) * 100) / 100;

export interface PayrollCalcInput {
  basic_salary: number;
  housing_allowance: number;
  other_allowances: number;
  is_saudi: boolean;
  unpaid_leave_days: number;
  /** Extra manual deductions. Defaults to 0. */
  other_deductions?: number;
  attendance_deduction?: number;
}

export interface PayrollCalcResult {
  basic_salary: number;
  housing_allowance: number;
  other_allowances: number;
  unpaid_leave_days: number;
  gosi_deduction: number;
  absence_deduction: number;
  other_deductions: number;
  net_salary: number;
  attendance_deduction: number;
}

export function calculatePayrollItem(input: PayrollCalcInput): PayrollCalcResult {
  const basic = round2(input.basic_salary);
  const housing = round2(input.housing_allowance);
  const other = round2(input.other_allowances);

  // 1) Gross = basic + housing + other allowances
  const gross = basic + housing + other;

  // Unpaid days can never exceed the 30 wage days.
  const unpaidDays = Math.min(
    Math.max(0, Math.floor(input.unpaid_leave_days)),
    WAGE_DAYS_PER_MONTH,
  );

  

  // 2) Absence = (gross / 30) * unpaid days
  const absenceDeduction = round2((gross / WAGE_DAYS_PER_MONTH) * unpaidDays);

  // 3) GOSI: Saudis only, 9.75% of (basic + housing)
  const gosiBase = Math.min(basic + housing, GOSI_MAX_BASE);
  const gosiDeduction = input.is_saudi ? round2(gosiBase * GOSI_SAUDI_RATE) : 0;

  const otherDeductions = round2(input.other_deductions ?? 0);

  const attendanceDeduction = round2(Math.max(0, input.attendance_deduction ?? 0));

  // 4) Net = gross - all deductions
  const netSalary = round2(
    gross - absenceDeduction - gosiDeduction - otherDeductions - attendanceDeduction,
  );
  

  return {
    basic_salary: basic,
    housing_allowance: housing,
    other_allowances: other,
    unpaid_leave_days: unpaidDays,
    gosi_deduction: gosiDeduction,
    absence_deduction: absenceDeduction,
    other_deductions: otherDeductions,
    attendance_deduction: attendanceDeduction,
    net_salary: netSalary,
  };
}

/* ------------------------------ date helpers ------------------------------ */

/** "2026-10" -> { start: "2026-10-01", end: "2026-10-31" } or null if invalid. */
export function monthToPeriod(
  month: unknown,
): { start: string; end: string } | null {
  if (typeof month !== "string") return null;
  const match = /^(\d{4})-(0[1-9]|1[0-2])$/.exec(month);
  if (!match) return null;

  const year = Number(match[1]);
  const monthNumber = Number(match[2]);
  const lastDay = new Date(Date.UTC(year, monthNumber, 0)).getUTCDate();

  return {
    start: `${match[1]}-${match[2]}-01`,
    end: `${match[1]}-${match[2]}-${String(lastDay).padStart(2, "0")}`,
  };
}

const DAY_MS = 86_400_000;

function dateKeyToUtc(key: string): number {
  const [y, m, d] = key.split("-").map(Number);
  return Date.UTC(y, m - 1, d);
}

/** Inclusive number of days shared by [aStart, aEnd] and [bStart, bEnd] (YYYY-MM-DD keys). */
export function overlapDays(
  aStart: string,
  aEnd: string,
  bStart: string,
  bEnd: string,
): number {
  const start = Math.max(dateKeyToUtc(aStart), dateKeyToUtc(bStart));
  const end = Math.min(dateKeyToUtc(aEnd), dateKeyToUtc(bEnd));
  if (end < start) return 0;
  return Math.round((end - start) / DAY_MS) + 1;
}