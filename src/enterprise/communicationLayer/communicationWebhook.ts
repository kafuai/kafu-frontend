import type {
  DeliveryCommunicationPayload,
  IncomingCommunicationPayload,
} from "./communicationEvent";
import type {
  CommunicationChannel,
} from "./communicationTypes";

export type CommunicationWebhookPayload =
  | {
      readonly kind: "incoming_message";
      readonly companyId: string;
      readonly channel: CommunicationChannel;
      readonly payload: IncomingCommunicationPayload;
    }
  | {
      readonly kind: "delivery_update";
      readonly companyId: string;
      readonly channel: CommunicationChannel;
      readonly payload: DeliveryCommunicationPayload;
    };

export interface CommunicationWebhookRequest {
  readonly headers: Readonly<Record<string, string | undefined>>;
  readonly rawBody: string;
}

export interface CommunicationWebhookVerifier {
  verify(request: CommunicationWebhookRequest): Promise<boolean>;
}

export interface CommunicationWebhookParser {
  parse(
    request: CommunicationWebhookRequest,
  ): Promise<CommunicationWebhookPayload>;
}

export class CommunicationWebhookError extends Error {
  constructor(
    message: string,
    readonly code:
      | "INVALID_SIGNATURE"
      | "INVALID_PAYLOAD"
      | "UNSUPPORTED_EVENT",
  ) {
    super(message);
    this.name = "CommunicationWebhookError";
  }
}

export async function validateCommunicationWebhook(
  verifier: CommunicationWebhookVerifier,
  request: CommunicationWebhookRequest,
): Promise<void> {
  const valid = await verifier.verify(request);

  if (!valid) {
    throw new CommunicationWebhookError(
      "Communication webhook signature is invalid.",
      "INVALID_SIGNATURE",
    );
  }
}
