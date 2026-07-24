export type EmailTemplateCategory =
  | "authentication"
  | "communication"
  | "notification"
  | "commercial"
  | "system";

export type EmailTemplateStatus =
  | "draft"
  | "active"
  | "archived";

export interface EmailTemplateVariable {
  readonly key: string;
  readonly label: string;
  readonly required: boolean;
  readonly fallbackValue?: string;
}

export interface EmailTemplate {
  readonly id: string;
  readonly key: string;
  readonly name: string;
  readonly category: EmailTemplateCategory;
  readonly status: EmailTemplateStatus;
  readonly subject: string;
  readonly htmlBody: string;
  readonly textBody: string;
  readonly variables: readonly EmailTemplateVariable[];
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface RenderedEmailTemplate {
  readonly subject: string;
  readonly htmlBody: string;
  readonly textBody: string;
}

export type EmailTemplateValues =
  Readonly<Record<string, string | number | boolean>>;
