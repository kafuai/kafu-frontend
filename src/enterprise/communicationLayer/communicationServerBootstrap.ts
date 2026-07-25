import "server-only";

import {
  registerCommunicationChannels,
} from "./communicationBootstrap";

import {
  CommunicationRuntime,
} from "./communicationRuntime";

import {
  createResendEmailTransportFromEnvironment,
} from "./transports/resendEmailTransport";

import {
  createMetaWhatsAppTransportFromEnvironment,
} from "./transports/metaWhatsAppTransport";

let serverCommunicationRuntime:
  CommunicationRuntime | null = null;

export function getServerCommunicationRuntime():
  CommunicationRuntime {
  if (!serverCommunicationRuntime) {
    serverCommunicationRuntime =
      registerCommunicationChannels(
        new CommunicationRuntime(),
        {
          email:
            createResendEmailTransportFromEnvironment(),
          whatsapp:
            createMetaWhatsAppTransportFromEnvironment(),
        },
      );
  }

  return serverCommunicationRuntime;
}

export function resetServerCommunicationRuntime():
  void {
  serverCommunicationRuntime = null;
}
