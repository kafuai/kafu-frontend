import type { SupabaseClient } from "@supabase/supabase-js";
import {
  LeaveValidationError,
  LeaveValidator,
} from "../utils/leaveValidator";

import { LeaveRequest } from "../models/leaveModel";
import {
  LeaveRequestInput,
  LeaveType,
  LeaveAttachment,
} from "../types/leaveTypes";
import { toDateKey } from "../utils/leaveValidator";

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
  reviewed_by: string | null;
  reviewed_at: string | null;
};

const OVERLAP_MESSAGE = {
    en: "A leave request already exists for the selected date range.",
    ar: "يوجد طلب إجازة مسجّل مسبقًا ضمن الفترة المحددة.",
    } as const;

/** Inclusive calendar-date overlap. Inputs are "YYYY-MM-DD" keys (lexicographic order == date order). */
export function datesOverlap(
  existingStart: string,
  existingEnd: string,
  newStart: string,
  newEnd: string,
): boolean {
  return existingStart <= newEnd && existingEnd >= newStart;
}

const ATTACHMENT_REQUIRED_MESSAGE = {
  en: "Sick leave certificate is required.",
  ar: "شهادة الإجازة المرضية مطلوبة.",
} as const;

function parseAttachment(requestData: Record<string, unknown>): LeaveAttachment | null {
  const a = requestData.attachment as Record<string, unknown> | undefined;
  if (
    !a ||
    typeof a.bucket !== "string" ||
    typeof a.path !== "string" ||
    typeof a.file_name !== "string"
  ) {
    return null;
  }
  return {
    bucket: a.bucket,
    path: a.path,
    fileName: a.file_name,
    mimeType: typeof a.mime_type === "string" ? a.mime_type : "",
    sizeBytes: typeof a.size_bytes === "number" ? a.size_bytes : 0,
  };
}

export class LeaveManager {
  private readonly validator =
    new LeaveValidator();

  constructor(
    private readonly supabase: SupabaseClient,
  ) {}


  private async getCurrentUserId(): Promise<string> {
    const {
      data: { user },
      error,
    } = await this.supabase.auth.getUser();

    if (error || !user) {
      throw new Error(
        "Authenticated user is required to review requests.",
      );
    }

    return user.id;
  }
  async request(
    input: LeaveRequestInput & {
      companyId: string;
    },
    messageLanguage: "ar" | "en" = "en",
  ): Promise<LeaveRequest> {

    if (!input.companyId) {
      throw new Error(
        "Company context is required.",
      );
    }
    const validation = this.validator.validate(input);

    if (input.type === "sick" && !input.attachment) {
      throw new LeaveValidationError([ATTACHMENT_REQUIRED_MESSAGE[messageLanguage]]);
    }

    if (!validation.valid) {
      throw new LeaveValidationError(
        validation.errors
      );
    }
    // Backend guard: must run BEFORE the INSERT.
    await this.assertNoApprovedOverlap(input, messageLanguage);

    const {
      data,
      error,
    } = await this.supabase
      .from("employee_requests")
        .insert({
        ...(input.id ? { id: input.id } : {}),
        user_id: input.employeeId,
        organization_id: input.organizationId,
        company_id: input.companyId,
        request_type: "leave",
        status: "pending",
        title: "Employee leave request",
        description: input.reason,
        request_data: {
          leave_type: input.type,
          start_date: new Date(input.startDate).toISOString(),
          end_date: new Date(input.endDate).toISOString(),
          reason: input.reason,
          ...(input.attachment
            ? {
                attachment: {
                  bucket: input.attachment.bucket,
                  path: input.attachment.path,
                  file_name: input.attachment.fileName,
                  mime_type: input.attachment.mimeType,
                  size_bytes: input.attachment.sizeBytes,
                },
              }
            : {}),
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

    async getAttachmentRef(id: string, organizationId: string) {
    const { data, error } = await this.supabase
      .from("employee_requests")
      .select("id,user_id,company_id,request_data")
      .eq("id", id)
      .eq("organization_id", organizationId)
      .eq("request_type", "leave")
      .maybeSingle();

    if (error) throw new Error(`Unable to load leave request: ${error.message}`);
    if (!data) return null;

    const requestData = (data.request_data ?? {}) as Record<string, unknown>;

    return {
      employeeId: data.user_id as string,
      companyId: data.company_id as string,
      leaveType:
        typeof requestData.leave_type === "string"
          ? requestData.leave_type
          : "other",
      startDate: new Date(String(requestData.start_date)).getTime(),
      endDate: new Date(String(requestData.end_date)).getTime(),
      attachment: parseAttachment(requestData),
    };
  }
    /**
   * Throws LeaveValidationError if the same employee already has an APPROVED
   * leave overlapping [startDate, endDate] (inclusive, calendar-date comparison).
   * pending / rejected / cancelled never block.
   */
  async assertNoApprovedOverlap(
    input: {
      employeeId: string;
      organizationId: string;
      startDate: number;
      endDate: number;
    },
    messageLanguage: "ar" | "en" = "en",
  ): Promise<void> {
    const { data, error } = await this.supabase
      .from("employee_requests")
      .select(
        "id,user_id,organization_id,company_id,request_type,status,description,request_data,created_at,reviewed_by,reviewed_at",
      )
      .eq("user_id", input.employeeId)
      .eq("organization_id", input.organizationId)
      .eq("request_type", "leave")
      .eq("status", "approved");

    if (error) {
      throw new Error(
        `Unable to verify existing leave requests: ${error.message}`,
      );
    }

    const newStart = toDateKey(input.startDate);
    const newEnd = toDateKey(input.endDate);

    const overlaps = ((data ?? []) as EmployeeRequestRow[])
      .map((row) => this.mapToLeaveRequest(row))
      .some(
        (leave) =>
          Number.isFinite(leave.startDate) &&
          Number.isFinite(leave.endDate) &&
          datesOverlap(
            toDateKey(leave.startDate),
            toDateKey(leave.endDate),
            newStart,
            newEnd,
          ),
      );

    if (overlaps) {
      throw new LeaveValidationError([OVERLAP_MESSAGE[messageLanguage]]);
    }
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
      reviewed_by: await this.getCurrentUserId(),
      reviewed_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("request_type", "leave")
    .eq("organization_id", organizationId) // <-- NEW: org scoping
    .select(
      "id,user_id,organization_id,company_id,request_type,status,description,request_data,created_at, reviewed_by, reviewed_at",
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
      reviewed_by: await this.getCurrentUserId(),
      reviewed_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("request_type", "leave")
    .eq("organization_id", organizationId) // <-- NEW: org scoping
    .select(
      "id,user_id,organization_id,company_id,request_type,status,description,request_data,created_at, reviewed_by, reviewed_at",
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
        "id,user_id,organization_id,company_id,request_type,status,description,request_data,created_at, reviewed_by, reviewed_at",
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

  async hasPendingRequest(
  organizationId: string,
  employeeId: string,
  ):
  Promise<boolean> {
  const { data, error } = await this.supabase
    .from("employee_requests")
    .select("id")
    .eq("request_type", "leave")
    .eq("status", "pending")
    .eq("organization_id", organizationId)
    .eq("user_id", employeeId)
    .limit(1);

  if (error) {
  if (error.code === "23505") {
    throw new LeaveValidationError([
      "You already have a pending leave request. Please wait for HR to review it.",
    ]);
  }

  throw new Error(
    `Unable to create leave request: ${error.message}`,
  );
}

  return (data ?? []).length > 0;
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

      reviewedBy:
        row.reviewed_by,

      reviewedAt:
        row.reviewed_at
          ? new Date(row.reviewed_at).getTime()
          : null,
      attachment: parseAttachment(requestData),
    };
  }
}