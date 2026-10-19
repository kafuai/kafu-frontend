import type { SupabaseClient } from "@supabase/supabase-js";
import type { LeaveType } from "@/src/enterprise/business/leave";

export interface CompanyPolicy {
  id: string;
  organizationId: string;
  companyId: string;
  category: string;
  policyType: string | null; // CHANGED: new field (null = legacy / untyped policy)
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}
// Must stay in sync with the policy_type values in TYPE_KEYWORDS.leave
const LEAVE_TYPE_TO_POLICY_TYPE: Record<LeaveType, string | null> = {
  annual: "annual_leave",
  sick: "sick_leave",
  emergency: "emergency_leave",
  unpaid: "unpaid_leave",
  maternity: "maternity_leave",
  other: null,
};

type PolicyRow = {
  id: string;
  organization_id: string;
  company_id: string;
  category: string;
  policy_type: string | null; // CHANGED
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
};

export interface CreatePolicyInput {
  organizationId: string;
  companyId: string;
  category: string;
  policyType?: string | null; // CHANGED
  title: string;
  content: string;
}

export interface UpdatePolicyInput {
  category?: string;
  policyType?: string | null; // CHANGED: undefined = leave unchanged, null/"" = clear
  title?: string;
  content?: string;
}
// Terms used ONLY to locate relevant policy text written by HR (ar/en).
const LEAVE_TYPE_POLICY_TERMS: Record<LeaveType, string[]> = {
  annual: ["annual", "vacation", "سنوي"],
  sick: ["sick", "medical", "مرض", "مريض"],
  emergency: ["emergency", "طارئ", "طوارئ"],
  unpaid: ["unpaid", "without pay", "بدون راتب", "بدون أجر", "غير مدفوعة"],
  maternity: ["maternity", "parental", "أمومة", "ولادة"],
  other: [],
};

// CHANGED: single place for the column list (policy_type added)
const POLICY_COLUMNS =
  "id,organization_id,company_id,category,policy_type,title,content,created_at,updated_at";

// CHANGED: dedicated error so routes can return 409 instead of 500
export class PolicyDuplicateError extends Error {
  constructor() {
    super(
      "A policy with the same category and type already exists for this organization.",
    );
    this.name = "PolicyDuplicateError";
  }
}

// CHANGED: "Annual Leave" -> "annual_leave"; empty -> null
export function normalizePolicyType(
  value?: string | null,
): string | null {
  const normalized = (value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, "_");
  return normalized || null;
}

/* ------------------------------------------------------------------ */
/* Retrieval helpers (CHANGED: all new)                                */
/* ------------------------------------------------------------------ */

const GENERAL_CATEGORY = "general";

// Keywords are normalized at match time, so Arabic spelling variants match.
const CATEGORY_KEYWORDS: Record<string, string[]> = {
  leave: ["leave", "vacation", "holiday", "إجازة", "اجازة", "عطلة"],
  employment_letter: [
    "employment letter",
    "salary certificate",
    "experience letter",
    "خطاب تعريف",
    "خطاب",
    "شهادة راتب",
  ],
  data_update: ["update my", "change my", "تحديث بيانات", "تعديل بيانات"],
};

// Must stay in sync with POLICY_TYPE_OPTIONS in policies/page.tsx
const TYPE_KEYWORDS: Record<string, Record<string, string[]>> = {
  leave: {
    annual_leave: ["annual", "سنوية", "سنوي"],
    sick_leave: ["sick", "مرضية", "مرضي"],
    emergency_leave: ["emergency", "طارئة", "طارئ"],
    unpaid_leave: ["unpaid", "بدون راتب", "بدون أجر", "غير مدفوعة"],
    maternity_leave: ["maternity", "أمومة", "ولادة"],
  },
};

const STOPWORDS = new Set([
  "the", "and", "for", "how", "many", "much", "what", "does", "can", "are",
  "you", "our", "with", "have", "any", "from", "that", "this", "per",
  "company", "employee", "employees", "policy", "policies", "day", "days",
  "شركه", "موظف", "موظفين", "سياسه", "سياسات", "يوم", "ايام", "اقدر",
  "استطيع", "اخذ", "ممكن", "عندي", "لدي", "يمكن", "ماذا", "كيف", "متي",
  "اين", "هذا", "هذه", "علي", "الي",
]);

function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[\u064B-\u065F\u0670\u0640]/g, "") // diacritics + tatweel
    .replace(/[أإآ]/g, "ا")
    .replace(/ى/g, "ي")
    .replace(/ة/g, "ه")
    .replace(/[\u0660-\u0669]/g, (d) => String(d.charCodeAt(0) - 0x0660))
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function extractKeywords(question: string): string[] {
  const keywords = new Set<string>();
  for (const raw of normalizeText(question).split(" ")) {
    const word = raw.replace(/^ال/, "");
    if (word.length > 2 && !STOPWORDS.has(word)) keywords.add(word);
  }
  return [...keywords];
}

function detectCategory(question: string): string | null {
  const text = normalizeText(question);
  for (const [category, words] of Object.entries(CATEGORY_KEYWORDS)) {
    if (words.some((w) => text.includes(normalizeText(w)))) return category;
  }
  return null;
}

// Returns a type only if EXACTLY one type matches (ambiguous -> null)
function detectPolicyType(category: string, question: string): string | null {
  const types = TYPE_KEYWORDS[category];
  if (!types) return null;
  const text = normalizeText(question);
  const hits = Object.entries(types)
    .filter(([, words]) => words.some((w) => text.includes(normalizeText(w))))
    .map(([type]) => type);
  return hits.length === 1 ? hits[0] : null;
}

// "Sufficient relevant evidence" for keyword-based matching
function isSufficient(matched: number, total: number): boolean {
  if (total === 0) return false;
  if (total === 1) return matched === 1;
  return matched >= 2 && matched / total >= 0.5;
}

function selectSufficient(
  pool: CompanyPolicy[],
  keywords: string[],
  limit: number,
): CompanyPolicy[] {
  return pool
    .map((policy) => {
      const haystack = normalizeText(`${policy.title} ${policy.content}`);
      const matched = keywords.filter((k) => haystack.includes(k)).length;
      return { policy, matched };
    })
    .filter((item) => isSufficient(item.matched, keywords.length))
    .sort((a, b) => b.matched - a.matched)
    .slice(0, limit)
    .map((item) => item.policy);
}

export interface PolicyRetrievalOptions {
  category?: string;      // explicit override (skips detection)
  policyType?: string;    // explicit override
  categoryHint?: string;  // lower priority, e.g. from the AI classifier
  limit?: number;
}

export interface PolicyRetrievalResult {
  policies: CompanyPolicy[];
  source: "category" | "general" | "none";
  category: string | null;
  policyType: string | null;
}

export class PolicyManager {
  constructor(private readonly supabase: SupabaseClient) {}

  async listForOrganization(
    organizationId: string,
  ): Promise<CompanyPolicy[]> {
    const { data, error } = await this.supabase
      .from("company_policies")
      .select(POLICY_COLUMNS) // CHANGED
      .eq("organization_id", organizationId)
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(
        `Unable to load company policies: ${error.message}`,
      );
    }

    return ((data ?? []) as PolicyRow[]).map(this.mapRow);
  }

  // CHANGED: duplicate check on organization + category + type
  private async assertNoDuplicate(
    organizationId: string,
    category: string,
    policyType: string | null,
    excludeId?: string,
  ): Promise<void> {
    if (!policyType) return; // untyped policies are not subject to uniqueness

    let query = this.supabase
      .from("company_policies")
      .select("id")
      .eq("organization_id", organizationId)
      .eq("category", category)
      .eq("policy_type", policyType)
      .limit(1);

    if (excludeId) query = query.neq("id", excludeId);

    const { data, error } = await query;

    if (error) {
      throw new Error(`Unable to validate policy: ${error.message}`);
    }
    if (data && data.length > 0) throw new PolicyDuplicateError();
  }

  async create(input: CreatePolicyInput): Promise<CompanyPolicy> {
    if (!input.title.trim() || !input.content.trim()) {
      throw new Error("Policy title and content are required.");
    }

    const policyType = normalizePolicyType(input.policyType); // CHANGED
    await this.assertNoDuplicate(
      input.organizationId,
      input.category,
      policyType,
    ); // CHANGED

    const { data, error } = await this.supabase
      .from("company_policies")
      .insert({
        organization_id: input.organizationId,
        company_id: input.companyId,
        category: input.category,
        policy_type: policyType, // CHANGED
        title: input.title.trim(),
        content: input.content.trim(),
      })
      .select(POLICY_COLUMNS) // CHANGED
      .single();

    if (error) {
      // CHANGED: race condition -> DB unique index is the last line of defense
      if ((error as { code?: string }).code === "23505") {
        throw new PolicyDuplicateError();
      }
      throw new Error(
        `Unable to create company policy: ${error.message}`,
      );
    }

    return this.mapRow(data as PolicyRow);
  }

  async update(
    id: string,
    organizationId: string,
    input: UpdatePolicyInput,
  ): Promise<CompanyPolicy> {
    // CHANGED: validate duplicates against the EFFECTIVE category + type
    if (input.category !== undefined || input.policyType !== undefined) {
      const { data: current, error: currentError } = await this.supabase
        .from("company_policies")
        .select("category,policy_type")
        .eq("id", id)
        .eq("organization_id", organizationId)
        .single();

      if (currentError || !current) {
        throw new Error("Policy not found.");
      }

      const effectiveCategory = input.category || current.category;
      const effectiveType =
        input.policyType === undefined
          ? (current.policy_type as string | null)
          : normalizePolicyType(input.policyType);

      await this.assertNoDuplicate(
        organizationId,
        effectiveCategory,
        effectiveType,
        id,
      );
    }

    const { data, error } = await this.supabase
      .from("company_policies")
      .update({
        ...(input.category ? { category: input.category } : {}),
        // CHANGED: allow setting or clearing the type
        ...(input.policyType !== undefined
          ? { policy_type: normalizePolicyType(input.policyType) }
          : {}),
        ...(input.title ? { title: input.title.trim() } : {}),
        ...(input.content ? { content: input.content.trim() } : {}),
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .eq("organization_id", organizationId)
      .select(POLICY_COLUMNS) // CHANGED
      .single();

    if (error) {
      if ((error as { code?: string }).code === "23505") {
        throw new PolicyDuplicateError(); // CHANGED
      }
      throw new Error(
        `Unable to update company policy: ${error.message}`,
      );
    }

    if (!data) {
      throw new Error("Policy not found.");
    }

    return this.mapRow(data as PolicyRow);
  }

  async delete(id: string, organizationId: string): Promise<void> {
    const { error } = await this.supabase
      .from("company_policies")
      .delete()
      .eq("id", id)
      .eq("organization_id", organizationId);

    if (error) {
      throw new Error(
        `Unable to delete company policy: ${error.message}`,
      );
    }
  }

  // UNCHANGED: kept as-is so nothing else breaks
  async searchRelevant(
    organizationId: string,
    question: string,
    limit = 5,
  ): Promise<CompanyPolicy[]> {
    const policies = await this.listForOrganization(organizationId);

    const keywords = question
      .toLowerCase()
      .split(/\s+/)
      .filter((word) => word.length > 2);

    if (keywords.length === 0 || policies.length === 0) {
      return policies.slice(0, limit);
    }

    const scored = policies.map((policy) => {
      const haystack =
        `${policy.title} ${policy.content}`.toLowerCase();

      const score = keywords.reduce(
        (total, word) =>
          haystack.includes(word) ? total + 1 : total,
        0,
      );

      return { policy, score };
    });

    const relevant = scored
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .map((item) => item.policy);

    return (relevant.length > 0 ? relevant : policies).slice(0, limit);
  }

  // CHANGED: new prioritized retrieval (primary category -> General -> none)
  async retrieve(
    organizationId: string,
    question: string,
    options: PolicyRetrievalOptions = {},
  ): Promise<PolicyRetrievalResult> {
    const limit = options.limit ?? 3;
    const all = await this.listForOrganization(organizationId);
    const keywords = extractKeywords(question);

    const hint =
      options.categoryHint && options.categoryHint in CATEGORY_KEYWORDS
        ? options.categoryHint
        : null;

    const category =
      options.category ?? detectCategory(question) ?? hint;

    const policyType = category
      ? (options.policyType ?? detectPolicyType(category, question))
      : null;

    // STEP 1: primary category (never includes General)
    if (category && category !== GENERAL_CATEGORY) {
      const inCategory = all.filter((p) => p.category === category);

      if (policyType) {
        // 1a) Exact Category + Type match is strong evidence on its own
        const typed = inCategory.filter((p) => p.policyType === policyType);
        if (typed.length > 0) {
          return {
            policies: typed.slice(0, limit),
            source: "category",
            category,
            policyType,
          };
        }
        // 1b) Type was detected but no typed policy exists:
        // only legacy untyped policies of this category are candidates.
        // Policies of OTHER explicit types (e.g. Sick Leave) are excluded.
        const legacy = inCategory.filter((p) => p.policyType === null);
        const hit = selectSufficient(legacy, keywords, limit);
        if (hit.length > 0) {
          return { policies: hit, source: "category", category, policyType };
        }
      } else {
        // 1c) No specific type detected: search the whole category by evidence
        const hit = selectSufficient(inCategory, keywords, limit);
        if (hit.length > 0) {
          return { policies: hit, source: "category", category, policyType };
        }
      }
    }

    // STEP 2: General is a fallback ONLY (reached after the primary failed,
    // or when no primary category could be determined)
    const general = selectSufficient(
      all.filter((p) => p.category === GENERAL_CATEGORY),
      keywords,
      limit,
    );
    if (general.length > 0) {
      return { policies: general, source: "general", category, policyType };
    }

    // STEP 3: nothing sufficient -> caller must not guess
    return { policies: [], source: "none", category, policyType };
  }
    /**
   * Leave-aware policy search (same organization only).
   * Priority: specific leave-type match in title > in content > general
   * "leave" category policy > user-message keywords (ranking only).
   * A general leave policy is a fallback; it never implies "annual".
   */
  async searchRelevantLeavePolicy(
    organizationId: string,
    leaveType: LeaveType,
    userMessage: string,
    limit = 5,
  ): Promise<CompanyPolicy[]> {
    const policies = await this.listForOrganization(organizationId);
    const typeTerms = LEAVE_TYPE_POLICY_TERMS[leaveType];
    const policyType = LEAVE_TYPE_TO_POLICY_TYPE[leaveType];

    // 1) Exact category + type match is authoritative on its own.
    if (policyType) {
      const typed = policies.filter(
        (p) => p.category === "leave" && p.policyType === policyType,
      );
      if (typed.length > 0) return typed.slice(0, limit);
    }

    // 2) Fallback pool: untyped (legacy/general) policies only.
    //    Policies explicitly typed as ANOTHER leave type are excluded.
    const pool = policies.filter(
      (p) => p.policyType === null || p.policyType === policyType,
    );

    const keywords = userMessage
      .toLowerCase()
      .split(/\s+/)
      .filter((word) => word.length > 2);

      
    const scored = policies.map((policy) => {
      const title = policy.title.toLowerCase();
      const content = policy.content.toLowerCase();

      const isLeaveCategory = policy.category === "leave";
      const typeInTitle = typeTerms.some((t) => title.includes(t));
      const typeInContent = typeTerms.some((t) => content.includes(t));
      const messageInTitle = keywords.some((w) => title.includes(w));
      const messageHits = keywords.filter(
        (w) => title.includes(w) || content.includes(w),
      ).length;

      const score =
        (isLeaveCategory ? 100 : 0) +
        (typeInTitle ? 1000 : 0) +
        (typeInContent ? 300 : 0) +
        Math.min(messageHits, 50);

      const relevant =
        isLeaveCategory || typeInTitle || typeInContent || messageInTitle;

      return { policy, score, relevant };
    });

    return scored
      .filter((item) => item.relevant)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map((item) => item.policy);
  }

  private mapRow(row: PolicyRow): CompanyPolicy {
    return {
      id: row.id,
      organizationId: row.organization_id,
      companyId: row.company_id,
      category: row.category,
      policyType: row.policy_type ?? null, // CHANGED
      title: row.title,
      content: row.content,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }
}