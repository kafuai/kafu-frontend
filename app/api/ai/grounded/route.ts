import "server-only";

import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  getAIServerRuntime,
} from "@/src/enterprise/ai/server-runtime";

import type {
  GroundedAIEvidence,
} from "@/src/enterprise/ai/grounded-ai";

import {
  resolveWorkspaceIdentity,
} from "@/lib/workspace-identity/tenantResolver";

import {
  createSupabaseServerClient,
} from "@/lib/supabase-auth/server";

interface GroundedAIRequestBody {
  task?: unknown;
  question?: unknown;

  workspaceId?: unknown;
  locale?: unknown;

  evidence?: unknown;
}

const asOptionalString = (
  value: unknown,
): string | undefined =>
  typeof value === "string"
    && value.trim().length > 0
    ? value.trim()
    : undefined;

const isEvidenceArray = (
  value: unknown,
): value is GroundedAIEvidence[] =>
  Array.isArray(value)
  && value.every(
    (item) =>
      typeof item === "object"
      && item !== null
      && typeof (
        item as {
          id?: unknown;
        }
      ).id === "string"
      && typeof (
        item as {
          source?: unknown;
        }
      ).source === "string"
      && typeof (
        item as {
          label?: unknown;
        }
      ).label === "string"
      && "value" in item,
  );

const unauthorizedResponse = () =>
  NextResponse.json(
    {
      error:
        "Authentication and an authorized company workspace are required.",
      code:
        "UNAUTHORIZED",
    },
    {
      status: 401,
    },
  );

export async function POST(
  request: NextRequest,
) {
  try {
    /*
     * Resolve authentication and tenant context
     * from the server-side Supabase session.
     *
     * Never trust company or tenant identifiers
     * supplied by the browser.
     */
    let identity;

    try {
      const supabase =
        await createSupabaseServerClient();

      identity =
        await resolveWorkspaceIdentity(
          supabase,
        );
    } catch (error) {
      console.warn(
        "KAFU grounded AI authorization failed.",
        error,
      );

      return unauthorizedResponse();
    }

    const body =
      (await request.json()) as GroundedAIRequestBody;

    const task =
      asOptionalString(
        body.task,
      );

    if (!task) {
      return NextResponse.json(
        {
          error:
            "A grounded AI task is required.",
          code:
            "TASK_REQUIRED",
        },
        {
          status: 400,
        },
      );
    }

    if (
      !isEvidenceArray(
        body.evidence,
      )
      || body.evidence.length === 0
    ) {
      return NextResponse.json(
        {
          error:
            "At least one valid evidence item is required.",
          code:
            "EVIDENCE_REQUIRED",
        },
        {
          status: 400,
        },
      );
    }

    const runtime =
      getAIServerRuntime();

    const correlationId =
      globalThis.crypto
        .randomUUID();

    const result =
      await runtime.groundedAI.generate({
        task,

        question:
          asOptionalString(
            body.question,
          ),

        evidence:
          body.evidence,

        context: {
          tenantId:
            identity.companyId,

          companyId:
            identity.companyId,

          userId:
            identity.userId,

          workspaceId:
            asOptionalString(
              body.workspaceId,
            ),

          locale:
            asOptionalString(
              body.locale,
            ),

          metadata: {
            organizationId:
              identity.organizationId,

            role:
              identity.role,

            identitySource:
              identity.source,
          },
        },

        correlationId,
      });

    return NextResponse.json(
      {
        data:
          result,

        context: {
          companyId:
            identity.companyId,

          organizationId:
            identity.organizationId,

          correlationId,
        },
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error(
      "KAFU grounded AI request failed.",
      error,
    );

    return NextResponse.json(
      {
        error:
          "Grounded AI generation failed.",

        code:
          "AI_GENERATION_FAILED",
      },
      {
        status: 500,
      },
    );
  }
}
