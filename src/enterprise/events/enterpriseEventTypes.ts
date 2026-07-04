export type EnterpriseEventName = string;

export type EnterpriseEventPayload = Record<string, unknown>;

export type EnterpriseEvent<TPayload extends EnterpriseEventPayload = EnterpriseEventPayload> = {
  name: EnterpriseEventName;
  payload: TPayload;
  emittedAt: string;
};

export type EnterpriseEventHandler<TPayload extends EnterpriseEventPayload = EnterpriseEventPayload> = (
  event: EnterpriseEvent<TPayload>,
) => void;