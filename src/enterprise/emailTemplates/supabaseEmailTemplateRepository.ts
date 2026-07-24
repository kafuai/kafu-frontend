import type {
  SupabaseClient,
} from "@supabase/supabase-js";

import type {
  EmailTemplateRepository,
} from "./emailTemplateRepository";
import type {
  EmailTemplate,
  EmailTemplateCategory,
  EmailTemplateStatus,
  EmailTemplateVariable,
} from "./emailTemplateTypes";

interface EmailTemplateRow {
  id: string;
  template_key: string;
  name: string;
  category: EmailTemplateCategory;
  status: EmailTemplateStatus;
  subject: string;
  html_body: string;
  text_body: string;
  variables: EmailTemplateVariable[];
  created_at: string;
  updated_at: string;
}

function mapEmailTemplate(
  row: EmailTemplateRow,
): EmailTemplate {
  return {
    id: row.id,
    key: row.template_key,
    name: row.name,
    category: row.category,
    status: row.status,
    subject: row.subject,
    htmlBody: row.html_body,
    textBody: row.text_body,
    variables: row.variables ?? [],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export class SupabaseEmailTemplateRepository
  implements EmailTemplateRepository {
  constructor(
    private readonly client: SupabaseClient,
  ) {}

  async getById(
    templateId: string,
  ): Promise<EmailTemplate | null> {
    const {
      data,
      error,
    } = await this.client
      .from("email_templates")
      .select("*")
      .eq("id", templateId)
      .maybeSingle<EmailTemplateRow>();

    if (error) {
      throw error;
    }

    return data
      ? mapEmailTemplate(data)
      : null;
  }

  async getByKey(
    templateKey: string,
  ): Promise<EmailTemplate | null> {
    const {
      data,
      error,
    } = await this.client
      .from("email_templates")
      .select("*")
      .eq("template_key", templateKey)
      .maybeSingle<EmailTemplateRow>();

    if (error) {
      throw error;
    }

    return data
      ? mapEmailTemplate(data)
      : null;
  }

  async list():
    Promise<readonly EmailTemplate[]> {
    const {
      data,
      error,
    } = await this.client
      .from("email_templates")
      .select("*")
      .order("category", {
        ascending: true,
      })
      .order("name", {
        ascending: true,
      });

    if (error) {
      throw error;
    }

    return (
      (data ?? []) as EmailTemplateRow[]
    ).map(mapEmailTemplate);
  }

  async save(
    template: EmailTemplate,
  ): Promise<EmailTemplate> {
    const payload = {
      id: template.id,
      template_key: template.key,
      name: template.name,
      category: template.category,
      status: template.status,
      subject: template.subject,
      html_body: template.htmlBody,
      text_body: template.textBody,
      variables: template.variables,
      created_at: template.createdAt,
      updated_at: template.updatedAt,
    };

    const {
      data,
      error,
    } = await this.client
      .from("email_templates")
      .upsert(payload, {
        onConflict: "id",
      })
      .select("*")
      .single<EmailTemplateRow>();

    if (error) {
      throw error;
    }

    return mapEmailTemplate(data);
  }

  async archive(
    templateId: string,
  ): Promise<void> {
    const {
      error,
    } = await this.client
      .from("email_templates")
      .update({
        status: "archived",
        updated_at:
          new Date().toISOString(),
      })
      .eq("id", templateId);

    if (error) {
      throw error;
    }
  }
}
