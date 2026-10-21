import { WAGE_DAYS_PER_MONTH } from "@/src/enterprise/business/payroll/payrollCalculator";

export type IncidentType = "late" | "early_leave" | "absence";

export interface DeductionPolicy {
  id: string;
  incident_type: IncidentType;
  method: "fixed_amount" | "percent_of_daily_wage" | "per_minute_of_daily_wage";
  value: number | string;
  wage_basis: "basic" | "gross" | "basic_plus_housing";
  min_minutes: number;
  max_amount: number | string | null;
}

export interface WageData {
  basic_salary: number | string | null;
  housing_allowance: number | string | null;
  other_allowances: number | string | null;
}

export type CalcOutcome =
  | { kind: "skip"; reason: string }
  | {
      kind: "proposal";
      amount: number | null;
      method: string | null;
      inputs: Record<string, unknown>;
      explanation: string;
    };

const n = (v: unknown) => {
  const x = Number(v ?? 0);
  return Number.isFinite(x) ? x : 0;
};
const round2 = (x: number) => Math.round((x + Number.EPSILON) * 100) / 100;

export function calculateProposal(params: {
  incidentType: IncidentType;
  minutes: number | null;
  scheduledMinutes: number;
  policy: DeductionPolicy | null;
  wage: WageData | null;
}): CalcOutcome {
  const { incidentType, minutes, scheduledMinutes, policy, wage } = params;

  if (!policy) {
    return {
      kind: "proposal", amount: null, method: null, inputs: {},
      explanation: "لا توجد سياسة خصم معتمدة لهذا النوع. يلزم تحديد السياسة أو المبلغ من المالك.",
    };
  }

  if (incidentType !== "absence" && (minutes ?? 0) < policy.min_minutes) {
    return { kind: "skip", reason: "below_policy_threshold" };
  }

  if (
    !wage ||
    wage.basic_salary == null || wage.housing_allowance == null || wage.other_allowances == null
  ) {
    return {
      kind: "proposal", amount: null, method: policy.method,
      inputs: { policyId: policy.id },
      explanation: "بيانات الراتب غير مكتملة في سجل الموظف، لا يمكن احتساب المبلغ.",
    };
  }

  const basic = n(wage.basic_salary);
  const housing = n(wage.housing_allowance);
  const other = n(wage.other_allowances);
  const wageBase =
    policy.wage_basis === "basic" ? basic
    : policy.wage_basis === "basic_plus_housing" ? basic + housing
    : basic + housing + other;

  const daily = wageBase / WAGE_DAYS_PER_MONTH;
  const value = n(policy.value);
  let amount = 0;
  let how = "";

  if (policy.method === "fixed_amount") {
    amount = value;
    how = `مبلغ ثابت ${value}`;
  } else if (policy.method === "percent_of_daily_wage") {
    amount = (daily * value) / 100;
    how = `${value}% من الأجر اليومي (${round2(daily)})`;
  } else {
    const mins = incidentType === "absence" ? scheduledMinutes : (minutes ?? 0);
    const perMinute = scheduledMinutes > 0 ? daily / scheduledMinutes : 0;
    amount = perMinute * mins * value;
    how = `${mins} دقيقة × ${round2(perMinute)} (أجر الدقيقة) × المعامل ${value}`;
  }

  const max = policy.max_amount == null ? null : n(policy.max_amount);
  let capped = false;
  if (max !== null && amount > max) { amount = max; capped = true; }

  amount = round2(Math.max(0, amount));

  return {
    kind: "proposal",
    amount,
    method: policy.method,
    inputs: {
      policyId: policy.id, wageBasis: policy.wage_basis, wageBase: round2(wageBase),
      dailyWage: round2(daily), minutes, scheduledMinutes, value, maxAmount: max, capped,
    },
    explanation: `${how}${capped ? ` (تم تطبيق الحد الأقصى ${max})` : ""} = ${amount}`,
  };
}