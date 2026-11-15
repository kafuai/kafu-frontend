import { getAIServerRuntime } from "@/src/enterprise/ai/server-runtime";
import type { LeaveType } from "@/src/enterprise/business/leave";

// Runtime list of the EXISTING LeaveType union (no new type introduced).
const VALID_LEAVE_TYPES: LeaveType[] = [
  "annual",
  "sick",
  "emergency",
  "unpaid",
  "maternity",
  "other",
];

const MIN_CONFIDENCE = 0.7;

export interface LeaveTypeResolution {
  /** null = the employee did not state / imply a type clearly. Never defaults to "annual". */
  leaveType: LeaveType | null;
  confidence: number;
}

export interface ResolveLeaveTypeContext {
  organizationId: string;
  companyId: string;
  userId: string;
  locale?: string;
}

const unresolved = (): LeaveTypeResolution => ({
  leaveType: null,
  confidence: 0,
});

function parseLeaveTypeText(rawText: string): LeaveTypeResolution {
  const match = rawText.match(/\{[\s\S]*?\}/);
  if (!match) return unresolved();

  try {
    const parsed = JSON.parse(match[0]) as {
      leaveType?: unknown;
      confidence?: unknown;
    };

    const leaveType = VALID_LEAVE_TYPES.includes(parsed.leaveType as LeaveType)
      ? (parsed.leaveType as LeaveType)
      : null;

    const confidence =
      typeof parsed.confidence === "number"
        ? Math.min(1, Math.max(0, parsed.confidence))
        : 0;

    if (!leaveType || confidence < MIN_CONFIDENCE) return unresolved();

    return { leaveType, confidence };
  } catch {
    return unresolved();
  }
}

export async function resolveLeaveType(
  message: string,
  context: ResolveLeaveTypeContext,
): Promise<LeaveTypeResolution> {
  const runtime = getAIServerRuntime();

  const task = [
    "You are a strict JSON classifier. The employee is asking HR for a leave.",
    'Return "leaveType": one of "annual", "sick", "emergency", "unpaid", "maternity", "other", or null.',
    "Rules:",
    '- Use null if the employee does not state or clearly imply the leave type (e.g. "I want leave from 10 to 12"). NEVER assume "annual".',
    '- Sick / medical / illness / doctor appointment (إجازة مرضية، أنا مريض، موعد عند الدكتور) => "sick".',
    '- Vacation / annual leave (إجازة سنوية، إجازتي السنوية) => "annual".',
    '- Urgent family or personal circumstances (ظرف طارئ) => "emergency".',
    '- Leave without pay (بدون راتب) => "unpaid".',
    '- Maternity / childbirth (أمومة، ولادة) => "maternity".',
    '- A clearly stated type that is not in the list (e.g. marriage leave) => "other".',
    'Return "confidence": a number between 0 and 1.',
    "Respond with ONLY the JSON object. No prose, no markdown fences.",
    'Example: {"leaveType":"sick","confidence":0.92}',
  ].join("\n");

  try {
    const result = await runtime.groundedAI.generate({
      task,
      question: message,
      evidence: [
        {
          id: "EMPLOYEE-MESSAGE",
          source: "Employee Chat",
          label: "Employee message",
          value: message,
        },
      ],
      context: {
        tenantId: context.companyId,
        companyId: context.companyId,
        userId: context.userId,
        locale: context.locale,
        metadata: { organizationId: context.organizationId },
      },
    });

    return parseLeaveTypeText(result.text);
  } catch (error) {
    console.error("Leave type resolution failed:", error);

    if (error instanceof Error && /RESOURCE_EXHAUSTED|429/.test(error.message)) {
      throw new Error("try again shortly");
    }

    // Safe behavior: unknown type => ask the employee, never guess.
    return unresolved();
  }
}