import {
  createSupabaseBrowserClient,
} from "../../../lib/supabase-auth/browser";

import {
  EmailTemplateService,
} from "./emailTemplateService";
import {
  SupabaseEmailTemplateRepository,
} from "./supabaseEmailTemplateRepository";

let browserEmailTemplateService:
  EmailTemplateService | null = null;

export function getBrowserEmailTemplateService():
  EmailTemplateService {
  if (!browserEmailTemplateService) {
    const client =
      createSupabaseBrowserClient();

    const repository =
      new SupabaseEmailTemplateRepository(
        client,
      );

    browserEmailTemplateService =
      new EmailTemplateService(
        repository,
      );
  }

  return browserEmailTemplateService;
}
