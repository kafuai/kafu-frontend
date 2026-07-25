import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  createSupabaseAdminClient,
} from "@/lib/supabase-auth/admin";

import {
  MetaWhatsAppWebhookProcessor,
  SupabaseMetaWhatsAppWebhookRepository,
  verifyMetaWhatsAppChallenge,
  verifyMetaWhatsAppSignature,
  type MetaWhatsAppWebhookPayload,
} from "@/src/enterprise/communicationLayer/whatsappWebhook";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function createProcessor():
  MetaWhatsAppWebhookProcessor {
  const client =
    createSupabaseAdminClient();

  return new MetaWhatsAppWebhookProcessor(
    new SupabaseMetaWhatsAppWebhookRepository(
      client,
    ),
  );
}

export async function GET(
  request: NextRequest,
): Promise<Response> {
  const searchParams =
    request.nextUrl.searchParams;

  const challenge =
    verifyMetaWhatsAppChallenge(
      searchParams.get("hub.mode"),
      searchParams.get(
        "hub.verify_token",
      ),
      searchParams.get(
        "hub.challenge",
      ),
    );

  if (!challenge) {
    return new NextResponse(
      "Webhook verification failed.",
      {
        status: 403,
        headers: {
          "Content-Type":
            "text/plain; charset=utf-8",
        },
      },
    );
  }

  return new NextResponse(
    challenge,
    {
      status: 200,
      headers: {
        "Content-Type":
          "text/plain; charset=utf-8",
      },
    },
  );
}

export async function POST(
  request: NextRequest,
): Promise<Response> {
  const rawBody =
    await request.text();

  const signature =
    request.headers.get(
      "x-hub-signature-256",
    );

  if (
    !verifyMetaWhatsAppSignature(
      rawBody,
      signature,
    )
  ) {
    return NextResponse.json(
      {
        accepted: false,
        error:
          "Invalid webhook signature.",
      },
      {
        status: 401,
      },
    );
  }

  let payload:
    MetaWhatsAppWebhookPayload;

  try {
    payload =
      JSON.parse(
        rawBody,
      ) as MetaWhatsAppWebhookPayload;
  } catch {
    return NextResponse.json(
      {
        accepted: false,
        error:
          "Webhook payload is not valid JSON.",
      },
      {
        status: 400,
      },
    );
  }

  try {
    const result =
      await createProcessor()
        .process(payload);

    return NextResponse.json(
      {
        accepted: true,
        ...result,
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Unknown webhook failure.";

    console.error(
      "[Meta WhatsApp Webhook]",
      message,
    );

    /*
     * A valid provider request receives 200 after parsing
     * to prevent uncontrolled Meta retries for unsupported
     * or non-processable business payloads.
     */
    return NextResponse.json(
      {
        accepted: true,
        processed: false,
        error: message,
      },
      {
        status: 200,
      },
    );
  }
}
