import type { SupabaseClient } from "@supabase/supabase-js";

export interface CompanyPolicy {
  id: string;
  organizationId: string;
  companyId: string;
  category: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

type PolicyRow = {
  id: string;
  organization_id: string;
  company_id: string;
  category: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
};

export interface CreatePolicyInput {
  organizationId: string;
  companyId: string;
  category: string;
  title: string;
  content: string;
}

export interface UpdatePolicyInput {
  category?: string;
  title?: string;
  content?: string;
}

export class PolicyManager {
  constructor(private readonly supabase: SupabaseClient) {}

  async listForOrganization(
    organizationId: string,
  ): Promise<CompanyPolicy[]> {
    const { data, error } = await this.supabase
      .from("company_policies")
      .select(
        "id,organization_id,company_id,category,title,content,created_at,updated_at",
      )
      .eq("organization_id", organizationId)
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(
        `Unable to load company policies: ${error.message}`,
      );
    }

    return ((data ?? []) as PolicyRow[]).map(this.mapRow);
  }

  async create(input: CreatePolicyInput): Promise<CompanyPolicy> {
    if (!input.title.trim() || !input.content.trim()) {
      throw new Error("Policy title and content are required.");
    }

    const { data, error } = await this.supabase
      .from("company_policies")
      .insert({
        organization_id: input.organizationId,
        company_id: input.companyId,
        category: input.category,
        title: input.title.trim(),
        content: input.content.trim(),
      })
      .select(
        "id,organization_id,company_id,category,title,content,created_at,updated_at",
      )
      .single();

    if (error) {
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
    const { data, error } = await this.supabase
      .from("company_policies")
      .update({
        ...(input.category ? { category: input.category } : {}),
        ...(input.title ? { title: input.title.trim() } : {}),
        ...(input.content ? { content: input.content.trim() } : {}),
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .eq("organization_id", organizationId) // org scoping — same pattern as LeaveManager
      .select(
        "id,organization_id,company_id,category,title,content,created_at,updated_at",
      )
      .single();

    if (error) {
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

  private mapRow(row: PolicyRow): CompanyPolicy {
    return {
      id: row.id,
      organizationId: row.organization_id,
      companyId: row.company_id,
      category: row.category,
      title: row.title,
      content: row.content,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }
}