import type {
  EmailTemplateRepository,
} from "./emailTemplateRepository";
import {
  renderEmailTemplate,
} from "./emailTemplateRenderer";
import type {
  EmailTemplate,
  EmailTemplateValues,
  RenderedEmailTemplate,
} from "./emailTemplateTypes";

export class EmailTemplateService {
  constructor(
    private readonly repository:
      EmailTemplateRepository,
  ) {}

  async renderByKey(
    templateKey: string,
    values: EmailTemplateValues,
  ): Promise<RenderedEmailTemplate> {
    const template =
      await this.repository.getByKey(
        templateKey,
      );

    if (!template) {
      throw new Error(
        `Email template not found: ${templateKey}`,
      );
    }

    if (template.status !== "active") {
      throw new Error(
        `Email template is not active: ${templateKey}`,
      );
    }

    return renderEmailTemplate(
      template,
      values,
    );
  }

  async saveTemplate(
    template: EmailTemplate,
  ): Promise<EmailTemplate> {
    if (!template.key.trim()) {
      throw new Error(
        "Email template key is required.",
      );
    }

    if (!template.subject.trim()) {
      throw new Error(
        "Email template subject is required.",
      );
    }

    if (!template.htmlBody.trim()) {
      throw new Error(
        "Email template HTML body is required.",
      );
    }

    return this.repository.save({
      ...template,
      key: template.key.trim(),
      name: template.name.trim(),
      subject: template.subject.trim(),
      updatedAt: new Date().toISOString(),
    });
  }
}
