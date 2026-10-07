import { randomUUID } from "node:crypto";

import { AIAgentExecutor } from "../aiAgentExecutor";
import { AIAgentRuntime } from "../aiAgentRuntime";
import { AIAgentExecution } from "../aiAgentExecution";
import { AIAgentProfile } from "../aiAgentTypes";
import { AIAgentTask } from "../aiAgentWorkTypes";

import {
  LeaveManager,
  LeaveValidationError,
  LeaveValidator,
  evaluateLeaveAllowance,
  type LeaveType,
} from "@/src/enterprise/business/leave";
import { PolicyManager } from "@/src/enterprise/business/policies/policyManager";
import { EmploymentLetterManager } from "@/src/enterprise/business/employmentLetters/employmentLetterManager";

import { getAIServerRuntime } from "@/src/enterprise/ai/server-runtime";
import { cleanGroundedAIText } from "@/lib/cleanGroundedAIText";

import {
  classifyEmployeeMessage,
  type EmployeeMessageClassification,
} from "./employeeExperienceClassification";
import { resolveLeavePolicyAllowance } from "./leavePolicyAllowance";
import { resolveLeaveType } from "@/src/enterprise/business/leave/types/leaveTypeResolver";

interface EmployeeExperienceRequest {
  message: string;
  employeeId: string;
  organizationId: string;
  companyId: string;
  locale?: string;
}

export interface EmployeeExperienceResult {
  type:
    | "leave_request"
    | "employment_letter_request"
    | "policy_answer"
    | "unsupported_category"
    | "clarification_needed";
  message: string;
  status: "pending" | "answered" | "not_supported" | "needs_info";
  requestId?: string;
  classification: EmployeeMessageClassification;
  citedPolicyIds?: string[];
}

/**
 * Generates a collision-safe identifier with a readable prefix.
 */
const newId = (prefix: string): string => `${prefix}-${randomUUID()}`;

/**
 * Converts Arabic-Indic (٠-٩) and Eastern Arabic-Indic / Persian (۰-۹)
 * digits to ASCII digits so date parsing works regardless of keyboard.
 */
function normalizeDigits(text: string): string {
  return text
    .replace(/[\u0660-\u0669]/g, (d) => String(d.charCodeAt(0) - 0x0660))
    .replace(/[\u06F0-\u06F9]/g, (d) => String(d.charCodeAt(0) - 0x06f0));
}

/**
 * Detects the language of the employee's message itself, rather than
 * relying on the UI locale toggle. This way a message written in
 * Arabic gets an Arabic reply even if the UI is set to English, and
 * vice versa.
 */
function detectMessageLanguage(message: string): "ar" | "en" {
  const arabicPattern = /[\u0600-\u06FF]/;
  return arabicPattern.test(message) ? "ar" : "en";
}

const LEAVE_TYPE_LABELS: Record<LeaveType, { ar: string; en: string }> = {
  annual: { ar: "الإجازة السنوية", en: "annual leave" },
  sick: { ar: "الإجازة المرضية", en: "sick leave" },
  emergency: { ar: "الإجازة الطارئة", en: "emergency leave" },
  unpaid: { ar: "الإجازة بدون راتب", en: "unpaid leave" },
  maternity: { ar: "إجازة الأمومة", en: "maternity leave" },
  other: { ar: "هذا النوع من الإجازات", en: "this type of leave" },
};

export class EmployeeExperienceAgent {
  private readonly executor: AIAgentExecutor;

  constructor(
    private readonly profile: AIAgentProfile,
    private readonly leaveManager: LeaveManager,
    private readonly policyManager: PolicyManager,
    private readonly employmentLetterManager: EmploymentLetterManager,
  ) {
    this.executor = new AIAgentExecutor(new AIAgentRuntime());
  }

  async execute(
    request: EmployeeExperienceRequest,
  ): Promise<EmployeeExperienceResult> {
    const messageLanguage = detectMessageLanguage(request.message);

    const classification = await classifyEmployeeMessage(
      request.message,
      {
        organizationId: request.organizationId,
        companyId: request.companyId,
        userId: request.employeeId,
        locale: request.locale,
      },
    );

    if (classification.kind === "inquiry") {
      return this.answerInquiry(
        request,
        classification,
        messageLanguage,
      );
    }

    if (classification.category === "leave") {
      return this.createLeaveRequest(
        request,
        classification,
        messageLanguage,
      );
    }

    if (classification.category === "employment_letter") {
      return this.createEmploymentLetterRequest(
        request,
        classification,
        messageLanguage,
      );
    }

    return {
      type: "unsupported_category",
      message:
        messageLanguage === "en"
          ? "Your message was classified, but automated processing for this type isn't enabled yet. It will be routed to HR."
          : "تم تصنيف طلبك، لكن المعالجة الآلية لهذا النوع غير مفعّلة بعد. سيتم تحويله لفريق الموارد البشرية.",
      status: "not_supported",
      classification,
    };
  }

  private async answerInquiry(
    request: EmployeeExperienceRequest,
    classification: EmployeeMessageClassification,
    messageLanguage: "ar" | "en",
  ): Promise<EmployeeExperienceResult> {
    const retrieval = await this.policyManager.retrieve(
      request.organizationId,
      request.message,
      {
        // Classifier is only a lower-priority hint; keyword detection wins
        categoryHint:
          classification.confidence >= 0.6
            ? classification.category
            : undefined,
      },
    );
    const relevantPolicies = retrieval.policies;

    if (relevantPolicies.length === 0) {
      return {
        type: "unsupported_category",
        message:
          messageLanguage === "en"
            ? "There isn't enough policy information to answer your question right now. It will be routed to HR."
            : "لا تتوفر لدي سياسات كافية للإجابة على استفسارك حاليًا. سيتم تحويله لفريق الموارد البشرية.",
        status: "not_supported",
        classification,
      };
    }

    const runtime = getAIServerRuntime();

    const task =
      messageLanguage === "en"
        ? "Answer the employee's question using only the attached company policies. If the policies are insufficient to answer, state that clearly and direct the employee to HR instead of guessing. Do not mention any technical identifiers or codes in your answer. Respond in English."
        : "أجب على استفسار الموظف باستخدام سياسات الشركة المرفقة فقط. إذا لم تكن السياسات كافية للإجابة، وضّح ذلك بصراحة ووجّه الموظف لفريق الموارد البشرية بدل تخمين الإجابة. لا تذكر أي معرّفات أو رموز تقنية بإجابتك. أجب باللغة العربية.";

    const result = await runtime.groundedAI.generate({
      task,
      question: request.message,
      evidence: relevantPolicies.map((policy) => ({
        id: policy.id,
        source: "Company Policy",
        label: policy.title,
        value: policy.content,
      })),
      context: {
        tenantId: request.companyId,
        companyId: request.companyId,
        userId: request.employeeId,
        locale: messageLanguage,
        metadata: {
          organizationId: request.organizationId,
        },
      },
    });

    return {
      type: "policy_answer",
      message: cleanGroundedAIText(result.text),
      status: "answered",
      classification,
      citedPolicyIds: result.citations.map(
        (citation) => citation.evidenceId,
      ),
    };
  }

  private async createEmploymentLetterRequest(
    request: EmployeeExperienceRequest,
    classification: EmployeeMessageClassification,
    messageLanguage: "ar" | "en",
  ): Promise<EmployeeExperienceResult> {
    const task: AIAgentTask = {
      id: newId("task"),
      goalId: newId("goal"),
      agentId: this.profile.id,
      organizationId: request.organizationId,
      title: "Employment letter request",
      description: request.message,
      priority: "medium",
      status: "queued",
      requiredCapabilities: ["employment-letter-request"],
      dependencies: [],
      expectedOutcome:
        "Create an employment letter request for the authenticated employee.",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const execution: AIAgentExecution = {
      id: newId("execution"),
      organizationId: request.organizationId,
      agentId: this.profile.id,
      taskId: task.id,
      status: "queued",
      profile: this.profile,
      task,
    };

    const result = await this.executor.execute(
      execution,
      async () => {
        const letterRequest =
          await this.employmentLetterManager.request({
            employeeId: request.employeeId,
            organizationId: request.organizationId,
            companyId: request.companyId,
            reason: request.message,
          });

        return {
          message:
            messageLanguage === "en"
              ? "Your employment letter request has been received and is now pending HR approval."
              : "تم استلام طلب خطاب التعريف وهو الآن بانتظار موافقة الموارد البشرية.",
          status: letterRequest.status,
          requestId: letterRequest.id,
        };
      },
    );

    if (
      result.status !== "completed" ||
      !result.output ||
      !result.output.requestId
    ) {
      throw new Error(
        result.errorMessage ??
          (messageLanguage === "en"
            ? "Employment letter request failed."
            : "فشل إنشاء طلب خطاب التعريف."),
      );
    }

    return {
      type: "employment_letter_request",
      message: String(
        result.output.message ??
          (messageLanguage === "en"
            ? "Your employment letter request has been sent."
            : "تم إرسال طلب خطاب التعريف."),
      ),
      status: "pending",
      requestId: String(result.output.requestId),
      classification,
    };
  }

  private async createLeaveRequest(
    request: EmployeeExperienceRequest,
    classification: EmployeeMessageClassification,
    messageLanguage: "ar" | "en",
  ): Promise<EmployeeExperienceResult> {
    // 0) Existing rule: no duplicate while a request is pending.
    const hasPending = await this.leaveManager.hasPendingRequest(
      request.organizationId,
      request.employeeId,
    );

    if (hasPending) {
      throw new LeaveValidationError([
        messageLanguage === "en"
          ? "You already have a pending leave request. Please wait for HR to review it before submitting a new one."
          : "لديك طلب إجازة قيد المراجعة بالفعل. يرجى الانتظار حتى تتم مراجعته من الموارد البشرية قبل تقديم طلب جديد.",
      ]);
    }

    // 1) Resolve leave type from the message. Never default to "annual".
    const { leaveType: resolvedLeaveType } = await resolveLeaveType(
      request.message,
      {
        organizationId: request.organizationId,
        companyId: request.companyId,
        userId: request.employeeId,
        locale: messageLanguage,
      },
    );

    if (!resolvedLeaveType) {
      return {
        type: "clarification_needed",
        message:
          messageLanguage === "en"
            ? "Which type of leave would you like to request (for example annual, sick, emergency, or other)? Please send your request again including the leave type and the start and end dates (dd/mm/yyyy)."
            : "ما نوع الإجازة التي ترغب بتقديمها؟ مثل إجازة سنوية، مرضية، طارئة أو غيرها. أعد إرسال طلبك مع ذكر نوع الإجازة وتاريخ البداية والنهاية (dd/mm/yyyy).",
        status: "needs_info",
        classification,
      };
    }

    // 2) Dates + existing validation (past dates, end < start, ...)
    const dates = this.extractDates(request.message, messageLanguage);

    const validation = new LeaveValidator().validate(
      {
        employeeId: request.employeeId,
        organizationId: request.organizationId,
        type: resolvedLeaveType,
        startDate: dates.startDate,
        endDate: dates.endDate,
        reason: request.message,
      },
      Date.now(),
      messageLanguage,
    );

    if (!validation.valid) {
      throw new LeaveValidationError(validation.errors);
    }

    // Approved-leave overlap check. Done OUTSIDE the executor so the
    // LeaveValidationError type is preserved (route returns 400, not 500).
    await this.leaveManager.assertNoApprovedOverlap(
      {
        employeeId: request.employeeId,
        organizationId: request.organizationId,
        startDate: dates.startDate,
        endDate: dates.endDate,
      },
      messageLanguage,
    );

    // 3) Company policy is the source of truth. No policy => no request.
    const policy = await resolveLeavePolicyAllowance({
      policyManager: this.policyManager,
      organizationId: request.organizationId,
      companyId: request.companyId,
      employeeId: request.employeeId,
      leaveType: resolvedLeaveType,
      userMessage: request.message,
    });

    if (!policy.covered) {
      const label = LEAVE_TYPE_LABELS[resolvedLeaveType];
      return {
        type: "unsupported_category",
        message:
          messageLanguage === "en"
            ? `I couldn't find a company policy that covers ${label.en}, so your request was not created. Please contact HR.`
            : `لم أجد سياسة في الشركة تغطي ${label.ar}، لذلك لم يتم إنشاء الطلب. يرجى التواصل مع الموارد البشرية.`,
        status: "not_supported",
        classification,
      };
    }

    // 4) Enforce the balance only if the policy explicitly states a days limit.
    if (policy.days !== null) {
      const existing = await this.leaveManager.list(
        request.organizationId,
        request.employeeId,
      );

      const evaluation = evaluateLeaveAllowance(
        {
          type: resolvedLeaveType,
          startDate: dates.startDate,
          endDate: dates.endDate,
        },
        policy.days,
        existing,
        messageLanguage,
      );

      if (!evaluation.allowed) {
        throw new LeaveValidationError([evaluation.message!]);
      }
    }

    const task: AIAgentTask = {
      id: newId("task"),
      goalId: newId("goal"),
      agentId: this.profile.id,
      organizationId: request.organizationId,
      title: "Employee leave request",
      description: request.message,
      priority: "medium",
      status: "queued",
      requiredCapabilities: ["leave-request"],
      dependencies: [],
      expectedOutcome:
        "Create a leave request for the authenticated employee.",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const execution: AIAgentExecution = {
      id: newId("execution"),
      organizationId: request.organizationId,
      agentId: this.profile.id,
      taskId: task.id,
      status: "queued",
      profile: this.profile,
      task,
    };

    const result = await this.executor.execute(
      execution,
      async () => {
        const leave = await this.leaveManager.request({
          employeeId: request.employeeId,
          organizationId: request.organizationId,
          companyId: request.companyId,
          type: resolvedLeaveType,
          startDate: dates.startDate,
          endDate: dates.endDate,
          reason: request.message,
        }, messageLanguage);
        

        return {
          message:
            messageLanguage === "en"
              ? "Your leave request has been received and is now pending HR approval."
              : "تم استلام طلب الإجازة وهو الآن بانتظار موافقة الموارد البشرية.",
          status: leave.status,
          requestId: leave.id,
        };
      },
    );

    if (
      result.status !== "completed" ||
      !result.output ||
      !result.output.requestId
    ) {
      throw new Error(
        result.errorMessage ??
          (messageLanguage === "en"
            ? "Employee Experience Agent failed."
            : "فشل تنفيذ طلب الموظف."),
      );
    }

    return {
      type: "leave_request",
      message: String(
        result.output.message ??
          (messageLanguage === "en"
            ? "Your leave request has been sent."
            : "تم إرسال طلب الإجازة."),
      ),
      status: "pending",
      requestId: String(result.output.requestId),
      classification,
    };
  }

  private extractDates(
    message: string,
    messageLanguage: "ar" | "en",
  ): {
    startDate: number;
    endDate: number;
  } {
    // Convert Arabic-Indic / Persian digits to ASCII before matching.
    const normalized = normalizeDigits(message);

    const matches = normalized.match(
      /\b(\d{1,2})[\/-](\d{1,2})[\/-](\d{4})\b/g,
    );

    if (!matches || matches.length < 2) {
      throw new LeaveValidationError([
        messageLanguage === "en"
          ? "Please provide the leave start and end dates in the format dd/mm/yyyy."
          : "الرجاء تحديد تاريخ بداية ونهاية الإجازة بالصيغة التالية: dd/mm/yyyy.",
      ]);
    }

    const parseDate = (value: string): number => {
      const [day, month, year] = value.split(/[\/-]/).map(Number);

      const date = new Date(Date.UTC(year, month - 1, day));

      if (
        date.getUTCFullYear() !== year ||
        date.getUTCMonth() !== month - 1 ||
        date.getUTCDate() !== day
      ) {
        throw new LeaveValidationError([
          messageLanguage === "en"
            ? `Invalid date: ${value}`
            : `تاريخ غير صالح: ${value}`,
        ]);
      }

      return date.getTime();
    };

    const startDate = parseDate(matches[0]);
    const endDate = parseDate(matches[1]);

    // The "end before start" check is handled by LeaveValidator
    // (with a localized message).
    return { startDate, endDate };
  }
}