import { CommunicationChannel, CommunicationPayload } from "./communicationTypes";

export type CommunicationTemplate = {
  id: string;
  organizationId: string;
  channel: CommunicationChannel;
  name: string;
  subject?: string;
  title?: string;
  body: string;
  variables: string[];
};

export function renderCommunicationTemplate(
  template: CommunicationTemplate,
  variables: Record<string, string>,
): CommunicationPayload {
  const render = (value?: string): string | undefined => {
    if (!value) return value;

    return Object.entries(variables).reduce(
      (result, [key, replacement]) =>
        result.replaceAll(`{{${key}}}`, replacement),
      value,
    );
  };

  return {
    subject: render(template.subject),
    title: render(template.title),
    body: render(template.body) ?? "",
  };
}