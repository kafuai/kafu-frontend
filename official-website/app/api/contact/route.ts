import { NextResponse } from "next/server";

type ContactPayload = {
  fullName?: unknown;
  workEmail?: unknown;
  organization?: unknown;
  role?: unknown;
  companySize?: unknown;
  interest?: unknown;
  message?: unknown;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function normalizeString(value: unknown, maxLength: number) {
  return typeof value === "string"
    ? value.trim().slice(0, maxLength)
    : "";
}

export async function POST(request: Request) {
  let payload: ContactPayload;

  try {
    payload = (await request.json()) as ContactPayload;
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "Invalid request body.",
      },
      { status: 400 }
    );
  }

  const submission = {
    fullName: normalizeString(payload.fullName, 120),
    workEmail: normalizeString(payload.workEmail, 180),
    organization: normalizeString(payload.organization, 180),
    role: normalizeString(payload.role, 140),
    companySize: normalizeString(payload.companySize, 60),
    interest: normalizeString(payload.interest, 80),
    message: normalizeString(payload.message, 3000),
    submittedAt: new Date().toISOString(),
    source: "kafu-ai-official-website",
  };

  if (
    submission.fullName.length < 2 ||
    !emailPattern.test(submission.workEmail) ||
    submission.organization.length < 2 ||
    submission.role.length < 2 ||
    !submission.companySize ||
    !submission.interest
  ) {
    return NextResponse.json(
      {
        success: false,
        message: "Please review the required information and try again.",
      },
      { status: 422 }
    );
  }

  const webhookUrl = process.env.CONTACT_WEBHOOK_URL;

  if (!webhookUrl) {
    return NextResponse.json(
      {
        success: false,
        message:
          "Online submissions are not configured yet. Please contact hello@kafu.ai directly.",
      },
      { status: 503 }
    );
  }

  try {
    const webhookResponse = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(submission),
      cache: "no-store",
    });

    if (!webhookResponse.ok) {
      throw new Error(
        `Contact webhook returned ${webhookResponse.status}.`
      );
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("KAFU AI contact submission failed:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          "We could not submit your request. Please contact hello@kafu.ai directly.",
      },
      { status: 502 }
    );
  }
}