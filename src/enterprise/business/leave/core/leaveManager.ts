import type { SupabaseClient } from "@supabase/supabase-js";

import { LeaveRequest } from "../models/leaveModel";
import {
  LeaveRequestInput,
  LeaveType,
} from "../types/leaveTypes";
import { LeaveValidator } from "../utils/leaveValidator";

type EmployeeRequestRow = {
  id: string;
  user_id: string;
  organization_id: string;
  company_id: string;
  request_type: string;
  status: string;
  description: string | null;
  request_data: Record<string, unknown>;
  created_at: string;
};

export class LeaveManager {
  private readonly validator =
    new LeaveValidator();

  constructor(
    private readonly supabase: SupabaseClient,
  ) {}

  async request(
    input: LeaveRequestInput & {
      companyId: string;
    },
  ): Promise<LeaveRequest> {
    if (
      !this.validator.validateRequest(
        input,
      )
    ) {
      throw new Error(
        "Invalid leave request.",
      );
    }

    if (!input.companyId) {
      throw new Error(
        "Company context is required.",
      );
    }

    const {
      data,
      error,
    } = await this.supabase
      .from("employee_requests")
      .insert({
        user_id: input.employeeId,

        organization_id:
          input.organizationId,

        company_id:
          input.companyId,

        request_type: "leave",

        status: "pending",

        title:
          "Employee leave request",

        description:
          input.reason,

        request_data: {
          leave_type: input.type,

          start_date:
            new Date(
              input.startDate,
            ).toISOString(),

          end_date:
            new Date(
              input.endDate,
            ).toISOString(),

          reason:
            input.reason,
        },
      })
      .select(
        "id,user_id,organization_id,company_id,request_type,status,description,request_data,created_at",
      )
      .single();

    if (error) {
      throw new Error(
        `Unable to create leave request: ${error.message}`,
      );
    }

    if (!data) {
      throw new Error(
        "Leave request was not created.",
      );
    }

    return this.mapToLeaveRequest(
      data as EmployeeRequestRow,
    );
  }

  async approve(
  id: string,
  organizationId: string,
): Promise<LeaveRequest> {
  const {
    data,
    error,
  } = await this.supabase
    .from("employee_requests")
    .update({
      status: "approved",
      reviewed_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("request_type", "leave")
    .eq("organization_id", organizationId) // <-- NEW: org scoping
    .select(
      "id,user_id,organization_id,company_id,request_type,status,description,request_data,created_at",
    )
    .single();

  if (error) {
    throw new Error(
      `Unable to approve leave request: ${error.message}`,
    );
  }

  if (!data) {
    throw new Error(
      "Leave request not found.",
    );
  }

  return this.mapToLeaveRequest(
    data as EmployeeRequestRow,
  );
}

async reject(
  id: string,
  organizationId: string,
  reason?: string,
): Promise<LeaveRequest> {
  const {
    data,
    error,
  } = await this.supabase
    .from("employee_requests")
    .update({
      status: "rejected",
      response_data: reason ? { reason } : {},
      reviewed_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("request_type", "leave")
    .eq("organization_id", organizationId) // <-- NEW: org scoping
    .select(
      "id,user_id,organization_id,company_id,request_type,status,description,request_data,created_at",
    )
    .single();

  if (error) {
    throw new Error(
      `Unable to reject leave request: ${error.message}`,
    );
  }

  if (!data) {
    throw new Error(
      "Leave request not found.",
    );
  }

  return this.mapToLeaveRequest(
    data as EmployeeRequestRow,
  );
}

  async list(
    organizationId?: string,
    employeeId?: string,
  ): Promise<LeaveRequest[]> {
    let query = this.supabase
      .from("employee_requests")
      .select(
        "id,user_id,organization_id,company_id,request_type,status,description,request_data,created_at",
      )
      .eq(
        "request_type",
        "leave",
      )
      .order("created_at", {
        ascending: false,
      });

    if (organizationId) {
      query = query.eq(
        "organization_id",
        organizationId,
      );
    }

    if (employeeId) {
      query = query.eq(
        "user_id",
        employeeId,
      );
    }

    const {
      data,
      error,
    } = await query;

    if (error) {
      throw new Error(
        `Unable to load leave requests: ${error.message}`,
      );
    }

    return (
      (data ?? []) as EmployeeRequestRow[]
    ).map((row) =>
      this.mapToLeaveRequest(row),
    );
  }

  private mapToLeaveRequest(
    row: EmployeeRequestRow,
  ): LeaveRequest {
    const requestData =
      row.request_data ?? {};

    const leaveType =
      typeof requestData.leave_type ===
      "string"
        ? requestData.leave_type
        : "other";

    const startDate = new Date(
      String(
        requestData.start_date,
      ),
    ).getTime();

    const endDate = new Date(
      String(
        requestData.end_date,
      ),
    ).getTime();

    return {
      id: row.id,

      employeeId:
        row.user_id,

      organizationId:
        row.organization_id,

      type:
        leaveType as LeaveType,

      status:
        row.status as LeaveRequest["status"],

      startDate,

      endDate,

      reason:
        typeof requestData.reason ===
        "string"
          ? requestData.reason
          : row.description ?? "",

      createdAt:
        new Date(
          row.created_at,
        ).getTime(),
    };
  }
}