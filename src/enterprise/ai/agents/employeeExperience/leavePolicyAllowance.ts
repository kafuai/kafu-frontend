import type { PolicyManager } from "@/src/enterprise/business/policies/policyManager";
import { getAIServerRuntime } from "@/src/enterprise/ai/server-runtime";

const CACHE_TTL_MS = 10 * 60 * 1000;

const cache = new Map<
  string,
  { value: number | null; expiresAt: number }
>();

const EXTRACTION_TASK = `
Read the attached company policies and extract the number of ANNUAL LEAVE
days an employee is entitled to per year.

Return ONLY a JSON object, with no extra text, no markdown and no evidence
identifiers, in exactly this shape:
{"found": boolean, "annualLeaveDays": number | null}

Rules:
- Set "found" to true only if a policy explicitly states a number of annual
  leave days per year.
- If the policy gives different values depending on conditions (for example
  years of service), return the base/default value.
- If the policies do not state a number clearly, return
  {"found": false, "annualLeaveDays": null}.
- Never guess or infer a number that is not written in the policies.
`.trim();

function parseAllowance(text: string): number | null {
  const match = text.match(/\{[\s\S]*\}/);

  if (!match) return null;

  try {
    const parsed = JSON.parse(match[0]) as {
      found?: unknown;
      annualLeaveDays?: unknown;
    };

    if (parsed.found !== true) return null;

    const days = Number(parsed.annualLeaveDays);

    if (!Number.isFinite(days) || days < 0 || days > 365) return null;

    return Math.floor(days);
  } catch {
    return null;
  }
}


export async function resolveAnnualLeaveAllowanceFromPolicy(params: {
  policyManager: PolicyManager;
  organizationId: string;
  companyId: string;
  employeeId: string;
}): Promise<number | null> {
  const cached = cache.get(params.organizationId);

  if (cached && cached.expiresAt > Date.now()) {
    return cached.value;
  }

  try {
    const policies = await params.policyManager.searchRelevant(
      params.organizationId,
      "annual leave days entitlement per year الإجازة السنوية عدد الأيام",
    );

    if (policies.length === 0) {
      cache.set(params.organizationId, {
        value: null,
        expiresAt: Date.now() + CACHE_TTL_MS,
      });
      return null;
    }

    const runtime = getAIServerRuntime();

    
    const result = await runtime.groundedAI.generate({
      task: EXTRACTION_TASK,
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

    const value = parseAllowance(result.text);

    cache.set(params.organizationId, {
      value,
      expiresAt: Date.now() + CACHE_TTL_MS,
    });

    return value;
  } catch (error) {
    console.error("Failed to resolve leave allowance from policy:", error);
    return null;
  }
}