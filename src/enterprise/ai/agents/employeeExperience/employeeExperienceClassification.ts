import { getAIServerRuntime } from "@/src/enterprise/ai/server-runtime";

export type EmployeeRequestCategory =
  | "leave"
  | "employment_letter"
  | "employee_inquiry"
  | "data_update"
  | "general";

export type EmployeeRequestKind = "inquiry" | "request";

export interface EmployeeMessageClassification {
  kind: EmployeeRequestKind;
  category: EmployeeRequestCategory;
  confidence: number;
}

const VALID_CATEGORIES: EmployeeRequestCategory[] = [
  "leave",
  "employment_letter",
  "employee_inquiry",
  "data_update",
  "general",
];

const VALID_KINDS: EmployeeRequestKind[] = ["inquiry", "request"];

function fallbackClassification(): EmployeeMessageClassification {
  return {
    kind: "request",
    category: "general",
    confidence: 0,
  };
}

function parseClassificationText(
  rawText: string,
): EmployeeMessageClassification {
  const jsonMatch = rawText.match(/\{[\s\S]*?\}/);

  if (!jsonMatch) {
    return fallbackClassification();
  }

  try {
    const parsed = JSON.parse(jsonMatch[0]) as {
      kind?: unknown;
      category?: unknown;
      confidence?: unknown;
    };

    const kind = VALID_KINDS.includes(
      parsed.kind as EmployeeRequestKind,
    )
      ? (parsed.kind as EmployeeRequestKind)
      : "request";

    const category = VALID_CATEGORIES.includes(
      parsed.category as EmployeeRequestCategory,
    )
      ? (parsed.category as EmployeeRequestCategory)
      : "general";

    const confidence =
      typeof parsed.confidence === "number"
        ? Math.min(1, Math.max(0, parsed.confidence))
        : 0.5;

    return { kind, category, confidence };
  } catch {
    return fallbackClassification();
  }
}

export interface ClassifyEmployeeMessageContext {
  organizationId: string;
  companyId: string;
  userId: string;
  locale?: string;
}

export async function classifyEmployeeMessage(
  message: string,
  context: ClassifyEmployeeMessageContext,
): Promise<EmployeeMessageClassification> {
  const runtime = getAIServerRuntime();

  const task = [
    "You are a strict JSON classifier for employee HR messages.",
    'Return "kind": "inquiry" (a question) or "request" (asking HR to do something).',
    'Return "category": one of "leave", "employment_letter", "employee_inquiry", "data_update", "general".',
    'Return "confidence": a number between 0 and 1.',
    "Respond with ONLY the JSON object. No prose, no markdown fences, no citations.",
    'Example: {"kind":"request","category":"leave","confidence":0.95}',
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
        metadata: {
          organizationId: context.organizationId,
        },
      },
    });

    console.log("RAW classification response:", result.text);

    return parseClassificationText(result.text);
    } catch (error) {
    console.error(
        "Employee message classification failed:",
        error,
    );

    const isRateLimited =
        error instanceof Error &&
        /RESOURCE_EXHAUSTED|429/.test(error.message);

    if (isRateLimited) {
        // Signal this distinctly so the caller can show an
        // honest "try again shortly" message instead of
        // silently treating it as an unclassifiable request.
        throw new Error("try again shortly");
    }

    return fallbackClassification();
    }
}