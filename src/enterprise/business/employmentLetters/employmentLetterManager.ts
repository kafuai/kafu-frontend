import type { SupabaseClient } from "@supabase/supabase-js";

export type EmploymentLetterStatus =
  | "pending"
  | "approved"
  | "rejected";

export interface EmploymentLetterRequest {
  id: string;
  employeeId: string;
  organizationId: string;
  status: EmploymentLetterStatus;
  reason: string;
  createdAt: number;
}

type EmployeeRequestRow = {
  id: string;
  user_id: string;
  organization_id: string;
  company_id: string;
  request_type: string;
  status: string;
  description: string | null;
  created_at: string;
};

export interface CreateEmploymentLetterInput {
  employeeId: string;
  organizationId: string;
  companyId: string;
  reason: string;
}

export class EmploymentLetterManager {
  constructor(private readonly supabase: SupabaseClient) {}

  async request(
    input: CreateEmploymentLetterInput,
  ): Promise<EmploymentLetterRequest> {
    if (!input.reason.trim()) {
      throw new Error(
        "Employment letter request requires a description.",
      );
    }

    const { data, error } = await this.supabase
      .from("employee_requests")
      .insert({
        user_id: input.employeeId,
        organization_id: input.organizationId,
        company_id: input.companyId,
        request_type: "employment_letter",
        status: "pending",
        title: "Employment letter request",
        description: input.reason,
        request_data: {
          reason: input.reason,
        },
      })
      .select(
        "id,user_id,organization_id,company_id,request_type,status,description,created_at",
      )
      .single();

    if (error) {
      throw new Error(
        `Unable to create employment letter request: ${error.message}`,
      );
    }

    if (!data) {
      throw new Error(
        "Employment letter request was not created.",
      );
    }

    return this.mapRow(data as EmployeeRequestRow);
  }

  async approve(
    id: string,
    organizationId: string,
  ): Promise<EmploymentLetterRequest> {
    const { data, error } = await this.supabase
      .from("employee_requests")
      .update({
        status: "approved",
        reviewed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .eq("request_type", "employment_letter")
      .eq("organization_id", organizationId)
      .select(
        "id,user_id,organization_id,company_id,request_type,status,description,created_at",
      )
      .single();

    if (error) {
      throw new Error(
        `Unable to approve employment letter request: ${error.message}`,
      );
    }

    if (!data) {
      throw new Error("Employment letter request not found.");
    }

    return this.mapRow(data as EmployeeRequestRow);
  }

  async reject(
    id: string,
    organizationId: string,
    reason?: string,
  ): Promise<EmploymentLetterRequest> {
    const { data, error } = await this.supabase
      .from("employee_requests")
      .update({
        status: "rejected",
        response_data: reason ? { reason } : {},
        reviewed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .eq("request_type", "employment_letter")
      .eq("organization_id", organizationId)
      .select(
        "id,user_id,organization_id,company_id,request_type,status,description,created_at",
      )
      .single();

    if (error) {
      throw new Error(
        `Unable to reject employment letter request: ${error.message}`,
      );
    }

    if (!data) {
      throw new Error("Employment letter request not found.");
    }

    return this.mapRow(data as EmployeeRequestRow);
  }

  async list(
    organizationId?: string,
    employeeId?: string,
  ): Promise<EmploymentLetterRequest[]> {
    let query = this.supabase
      .from("employee_requests")
      .select(
        "id,user_id,organization_id,company_id,request_type,status,description,created_at",
      )
      .eq("request_type", "employment_letter")
      .order("created_at", { ascending: false });

    if (organizationId) {
      query = query.eq("organization_id", organizationId);
    }

    if (employeeId) {
      query = query.eq("user_id", employeeId);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(
        `Unable to load employment letter requests: ${error.message}`,
      );
    }

    return ((data ?? []) as EmployeeRequestRow[]).map((row) =>
      this.mapRow(row),
    );
  }

  private mapRow(
    row: EmployeeRequestRow,
  ): EmploymentLetterRequest {
    return {
      id: row.id,
      employeeId: row.user_id,
      organizationId: row.organization_id,
      status: row.status as EmploymentLetterStatus,
      reason: row.description ?? "",
      createdAt: new Date(row.created_at).getTime(),
    };
  }
}