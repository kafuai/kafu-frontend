import "server-only";

import {
  createHmac,
  timingSafeEqual,
} from "node:crypto";

function requireSecret(
  name: string,
  value: string | undefined,
): string {
  const normalized = value?.trim();

  if (!normalized) {
    throw new Error(
      `Missing required webhook secret: ${name}`,
    );
  }

  return normalized;
}

export function verifyMetaWhatsAppChallenge(
  mode: string | null,
  verifyToken: string | null,
  challenge: string | null,
): string | null {
  if (
    mode !== "subscribe" ||
    !verifyToken ||
    !challenge
  ) {
    return null;
  }

  const expectedToken =
    requireSecret(
      "META_WHATSAPP_VERIFY_TOKEN",
      process.env
        .META_WHATSAPP_VERIFY_TOKEN,
    );

  const providedBuffer =
    Buffer.from(verifyToken);

  const expectedBuffer =
    Buffer.from(expectedToken);

  if (
    providedBuffer.length !==
    expectedBuffer.length
  ) {
    return null;
  }

  return timingSafeEqual(
    providedBuffer,
    expectedBuffer,
  )
    ? challenge
    : null;
}

export function verifyMetaWhatsAppSignature(
  rawBody: string,
  signatureHeader: string | null,
): boolean {
  if (
    !signatureHeader?.startsWith(
      "sha256=",
    )
  ) {
    return false;
  }

  const providedHex =
    signatureHeader.slice(
      "sha256=".length,
    );

  if (
    !/^[a-f0-9]{64}$/i.test(
      providedHex,
    )
  ) {
    return false;
  }

  const appSecret =
    requireSecret(
      "META_WHATSAPP_APP_SECRET",
      process.env
        .META_WHATSAPP_APP_SECRET,
    );

  const expectedHex =
    createHmac(
      "sha256",
      appSecret,
    )
      .update(rawBody, "utf8")
      .digest("hex");

  const providedBuffer =
    Buffer.from(
      providedHex,
      "hex",
    );

  const expectedBuffer =
    Buffer.from(
      expectedHex,
      "hex",
    );

  return (
    providedBuffer.length ===
      expectedBuffer.length &&
    timingSafeEqual(
      providedBuffer,
      expectedBuffer,
    )
  );
}
