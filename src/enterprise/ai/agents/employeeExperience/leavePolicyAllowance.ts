import type { PolicyManager } from "@/src/enterprise/business/policies/policyManager";
import type { LeaveType } from "@/src/enterprise/business/leave";
import { getAIServerRuntime } from "@/src/enterprise/ai/server-runtime";

const CACHE_TTL_MS = 10 * 60 * 1000;

export interface LeavePolicyResolution {
  /** true only if company policies explicitly address this leave type (or state rules for all leave types). */
  covered: boolean;
  /** Days per year for THIS leave type, only if explicitly written in the policy. */
  days: number | null;
}

const cache = new Map<
  string,
  { value: LeavePolicyResolution; expiresAt: number }
>();

const LEAVE_TYPE_DESCRIPTIONS: Record<LeaveType, string> = {
  annual: "annual leave / vacation",
  sick: "sick / medical leave",
  emergency: "emergency leave",
  unpaid: "unpaid leave",
  maternity: "maternity leave",
  other: "the specific leave type the employee describes in the question",
};

function buildExtractionTask(leaveType: LeaveType): string {
  return `
Read the attached company policies and determine how they treat this leave type: ${LEAVE_TYPE_DESCRIPTIONS[leaveType]}.

Return ONLY a JSON object, with no extra text, no markdown and no evidence
identifiers, in exactly this shape:
{"covered": boolean, "amount": number | null, "unit": "days" | "weeks" | "months" | null}

Rules:
- "covered" is true only if a policy explicitly addresses this leave type, or
  explicitly states rules that apply to ALL leave types.
- "amount" and "unit" are the yearly entitlement for THIS leave type, exactly
  as written in the policy (e.g. "4 weeks" => amount 4, unit "weeks").
  Do NOT convert units yourself. Arabic units: أيام/يوم => days,
  أسابيع/أسبوع => weeks, أشهر/شهر => months.
- If it varies by conditions (e.g. years of service), return the base/default value.
- Never use another leave type's number. Never guess or infer. Do not use
  general knowledge or labor-law defaults; only the attached policies.
- If not covered, return {"covered": false, "amount": null, "unit": null}.
`.trim();
}

const DAYS_PER_UNIT = { days: 1, weeks: 7, months: 30 } as const;

function parseResolution(text: string): LeavePolicyResolution {
  const notCovered = { covered: false, days: null };
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) return notCovered;

  try {
    const parsed = JSON.parse(match[0]) as {
      covered?: unknown;
      amount?: unknown;
      unit?: unknown;
      days?: unknown; // backward compat with the old shape
    };

    if (parsed.covered !== true) return notCovered;

    let days: number | null = null;

    if (
      typeof parsed.amount === "number" &&
      Number.isFinite(parsed.amount) &&
      parsed.amount >= 0 &&
      typeof parsed.unit === "string" &&
      parsed.unit in DAYS_PER_UNIT
    ) {
      days = Math.floor(
        parsed.amount * DAYS_PER_UNIT[parsed.unit as keyof typeof DAYS_PER_UNIT],
      );
    } else if (typeof parsed.days === "number" && Number.isFinite(parsed.days) && parsed.days >= 0) {
      days = Math.floor(parsed.days);
    }

    if (days !== null && days > 365) days = null;

    return { covered: true, days };
  } catch {
    return notCovered;
  }
}

export async function resolveLeavePolicyAllowance(params: {
  policyManager: PolicyManager;
  organizationId: string;
  companyId: string;
  employeeId: string;
  leaveType: LeaveType;
  userMessage: string;
}): Promise<LeavePolicyResolution> {
  // "other" depends on what the employee wrote, so it is not cached.
  const cacheable = params.leaveType !== "other";
  const cacheKey = `${params.organizationId}:${params.leaveType}`;

  if (cacheable) {
    const cached = cache.get(cacheKey);
    if (cached && cached.expiresAt > Date.now()) return cached.value;
  }

  const policies = await params.policyManager.searchRelevantLeavePolicy(
    params.organizationId,
    params.leaveType,
    params.userMessage,
  );

  // No policy: do not cache, so a newly added policy takes effect immediately.
  if (policies.length === 0) return { covered: false, days: null };

  const runtime = getAIServerRuntime();

  // Errors propagate on purpose: an AI failure must not look like "no policy".
  const result = await runtime.groundedAI.generate({
    task: buildExtractionTask(params.leaveType),
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

  const value = parseResolution(result.text);

  if (cacheable) {
    cache.set(cacheKey, { value, expiresAt: Date.now() + CACHE_TTL_MS });
  }

  return value;
}