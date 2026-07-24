import type {
  EmailTemplateRepository,
} from "./emailTemplateRepository";
import {
  enterpriseEmailTemplates,
} from "./enterpriseEmailTemplateCatalog";

export interface EmailTemplateBootstrapResult {
  readonly created: number;
  readonly skipped: number;
}

export class EmailTemplateBootstrapService {
  constructor(
    private readonly repository:
      EmailTemplateRepository,
  ) {}

  async bootstrap():
    Promise<EmailTemplateBootstrapResult> {
    let created = 0;
    let skipped = 0;

    for (
      const template
      of enterpriseEmailTemplates
    ) {
      const existing =
        await this.repository.getByKey(
          template.key,
        );

      if (existing) {
        skipped += 1;
        continue;
      }

      await this.repository.save({
        ...template,
        createdAt:
          new Date().toISOString(),
        updatedAt:
          new Date().toISOString(),
      });

      created += 1;
    }

    return {
      created,
      skipped,
    };
  }
}
