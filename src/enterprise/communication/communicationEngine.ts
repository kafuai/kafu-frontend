import { CommunicationMessage } from "./communicationTypes";
import { dispatchCommunication } from "./communicationDispatcher";
import { CommunicationDeliveryTracker } from "./communicationDeliveryTracker";
import { createCommunicationDeliveryRecord } from "./communicationDelivery";

export class CommunicationEngine {
  constructor(
    private readonly tracker = new CommunicationDeliveryTracker(),
  ) {}

  dispatch(message: CommunicationMessage): CommunicationMessage {
    const prepared = dispatchCommunication(message);

    this.tracker.track(
      createCommunicationDeliveryRecord({
        messageId: prepared.id,
        organizationId: prepared.organizationId,
        channel: prepared.channel,
        status: prepared.status,
      }),
    );

    return prepared;
  }

  getTracker(): CommunicationDeliveryTracker {
    return this.tracker;
  }
}