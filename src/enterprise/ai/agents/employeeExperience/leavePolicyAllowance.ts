import type { PolicyManager, CompanyPolicy } from "@/src/enterprise/business/policies/policyManager";
import type { LeaveType } from "@/src/enterprise/business/leave";
import { getAIServerRuntime } from "@/src/enterprise/ai/server-runtime";

export interface LeavePolicyResolution {
  /** true only if company policies explicitly address this leave type (or state rules for all leave types). */
  covered: boolean;
  /** Days per year for THIS leave type, only if explicitly written in the policy. */
  days: number | null;
}

type StoredLeaveType = Exclude<LeaveType, "other">;
type StoredAllowances = NonNullable<CompanyPolicy["leaveAllowances"]>;

const LEAVE_TYPES: StoredLeaveType[] = [
  "annual",
  "sick",
  "emergency",
  "unpaid",
  "maternity",
];

const LEAVE_TYPE_DESCRIPTIONS: Record<StoredLeaveType, string> = {
  annual: "annual leave / vacation",
  sick: "sick / medical leave",
  emergency: "emergency leave",
  unpaid: "unpaid leave",
  maternity: "maternity leave",
};

const DAYS_PER_UNIT = { days: 1, weeks: 7, months: 30 } as const;

function buildExtractionTask(): string {
  return `
Read ONLY this one company policy and extract the yearly entitlement for each leave type it explicitly covers.

Return ONLY a JSON object in exactly this shape:
{
  "annual": {"covered": boolean, "amount": number | null, "unit": "days" | "weeks" | "months" | null},
  "sick": {"covered": boolean, "amount": number | null, "unit": "days" | "weeks" | "months" | null},
  "emergency": {"covered": boolean, "amount": number | null, "unit": "days" | "weeks" | "months" | null},
  "unpaid": {"covered": boolean, "amount": number | null, "unit": "days" | "weeks" | "months" | null},
  "maternity": {"covered": boolean, "amount": number | null, "unit": "days" | "weeks" | "months" | null}
}

Rules:
- "covered" is true only if THIS policy explicitly addresses that leave type, or explicitly states rules applying to ALL leave types.
- Extract the yearly entitlement exactly as written. Do NOT convert units yourself. Arabic units: أيام/يوم => days, أسابيع/أسبوع => weeks, أشهر/شهر => months.
- If entitlement varies by conditions (e.g. years of service), return the base/default value.
- Never use another leave type's number. Never guess or infer. Do not use general knowledge or labor-law defaults.
- If a type is not covered, return {"covered": false, "amount": null, "unit": null} for it.
- If covered but no numeric entitlement is explicitly stated, return covered=true with amount=null and unit=null.
`.trim();
}

function parseStoredAllowances(text: string): StoredAllowances {
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) throw new Error("AI returned no valid leave allowance JSON.");

  const parsed = JSON.parse(match[0]) as Record<string, unknown>;
  const result: StoredAllowances = {};

  for (const leaveType of LEAVE_TYPES) {
    const item = parsed[leaveType];
    if (!item || typeof item !== "object") {
      result[leaveType] = { covered: false, days: null };
      continue;
    }

    const value = item as { covered?: unknown; amount?: unknown; unit?: unknown };
    if (value.covered !== true) {
      result[leaveType] = { covered: false, days: null };
      continue;
    }

    let days: number | null = null;
    if (
      typeof value.amount === "number" &&
      Number.isFinite(value.amount) &&
      value.amount >= 0 &&
      typeof value.unit === "string" &&
      Object.prototype.hasOwnProperty.call(DAYS_PER_UNIT, value.unit)
    ) {
      days = Math.floor(
        value.amount * DAYS_PER_UNIT[value.unit as keyof typeof DAYS_PER_UNIT],
      );
    }
    if (days !== null && days > 365) days = null;
    result[leaveType] = { covered: true, days };
  }

  return result;
}

function buildOtherTask(): string {
  return `
Read the attached company policies and determine whether they explicitly cover the specific leave type described by the employee.
Return ONLY JSON: {"covered": boolean, "amount": number | null, "unit": "days" | "weeks" | "months" | null}.
Never guess, use another leave type's entitlement, or use general labor-law defaults. If not explicitly covered, return covered=false and null amount/unit.
`.trim();
}

function parseOtherResolution(text: string): LeavePolicyResolution {
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) return { covered: false, days: null };
  try {
    const value = JSON.parse(match[0]) as { covered?: unknown; amount?: unknown; unit?: unknown };
    if (value.covered !== true) return { covered: false, days: null };
    let days: number | null = null;
    if (
      typeof value.amount === "number" && Number.isFinite(value.amount) && value.amount >= 0 &&
      typeof value.unit === "string" && Object.prototype.hasOwnProperty.call(DAYS_PER_UNIT, value.unit)
    ) {
      days = Math.floor(value.amount * DAYS_PER_UNIT[value.unit as keyof typeof DAYS_PER_UNIT]);
    }
    if (days !== null && days > 365) days = null;
    return { covered: true, days };
  } catch {
    return { covered: false, days: null };
  }
}

async function extractPolicyAllowances(params: {
  policyManager: PolicyManager;
  policy: CompanyPolicy;
  organizationId: string;
  companyId: string;
  employeeId: string;
}): Promise<StoredAllowances> {
  const runtime = getAIServerRuntime();
  const result = await runtime.groundedAI.generate({
    task: buildExtractionTask(),
    question: "Extract the leave entitlements stated in this company policy.",
    evidence: [{
      id: params.policy.id,
      source: "Company Policy",
      label: params.policy.title,
      value: params.policy.content,
    }],
    context: {
      tenantId: params.companyId,
      companyId: params.companyId,
      userId: params.employeeId,
      locale: "en",
      metadata: { organizationId: params.organizationId, policyId: params.policy.id },
    },
  });

  const allowances = parseStoredAllowances(result.text);
  await params.policyManager.saveLeaveAllowances(
    params.policy.id,
    params.organizationId,
    allowances,
  );
  return allowances;
}

export async function resolveLeavePolicyAllowance(params: {
  policyManager: PolicyManager;
  organizationId: string;
  companyId: string;
  employeeId: string;
  leaveType: LeaveType;
  userMessage: string;
}): Promise<LeavePolicyResolution> {
  const policies = await params.policyManager.searchRelevantLeavePolicy(
    params.organizationId,
    params.leaveType,
    params.userMessage,
  );

  if (policies.length === 0) return { covered: false, days: null };

  // "other" is contextual and cannot be safely stored as a reusable allowance.
  if (params.leaveType === "other") {
    const runtime = getAIServerRuntime();
    const result = await runtime.groundedAI.generate({
      task: buildOtherTask(),
      question: params.userMessage,
      evidence: policies.map((policy) => ({
        id: policy.id,
        source: "Company Policy",
        label: policy.title,
        value: policy.content,
      })),
      context: {
        tenantId: params.companyId,
        companyId: params.companyId,
        userId: params.employeeId,
        locale: "en",
        metadata: { organizationId: params.organizationId },
      },
    });
    return parseOtherResolution(result.text);
  }

  let coveredWithoutAmount = false;
  for (const policy of policies) {
    // An empty/null value means this policy has not yet been analyzed.
    const stored = policy.leaveAllowances;
    const hasRequestedType = Boolean(
      stored && Object.prototype.hasOwnProperty.call(stored, params.leaveType),
    );
    const allowances: StoredAllowances = hasRequestedType && stored
      ? stored
      : await extractPolicyAllowances({
          policyManager: params.policyManager,
          policy,
          organizationId: params.organizationId,
          companyId: params.companyId,
          employeeId: params.employeeId,
        });

    const allowance = allowances[params.leaveType];
    if (!allowance?.covered) continue;
    if (allowance.days !== null) return { covered: true, days: allowance.days };
    coveredWithoutAmount = true;
  }

  return coveredWithoutAmount
    ? { covered: true, days: null }
    : { covered: false, days: null };
}
