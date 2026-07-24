import type {
  EmailTemplate,
} from "./emailTemplateTypes";

export interface EmailTemplateRepository {
  getById(
    templateId: string,
  ): Promise<EmailTemplate | null>;

  getByKey(
    templateKey: string,
  ): Promise<EmailTemplate | null>;

  list(): Promise<readonly EmailTemplate[]>;

  save(
    template: EmailTemplate,
  ): Promise<EmailTemplate>;

  archive(
    templateId: string,
  ): Promise<void>;
}
