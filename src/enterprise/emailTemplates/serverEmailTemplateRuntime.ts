import {
  createSupabaseServerClient,
} from "../../../lib/supabase-auth/server";

import {
  EmailTemplateBootstrapService,
} from "./emailTemplateBootstrapService";
import {
  EmailTemplateService,
} from "./emailTemplateService";
import {
  SupabaseEmailTemplateRepository,
} from "./supabaseEmailTemplateRepository";

export async function createServerEmailTemplateService():
  Promise<EmailTemplateService> {
  const client =
    await createSupabaseServerClient();

  return new EmailTemplateService(
    new SupabaseEmailTemplateRepository(
      client,
    ),
  );
}

export async function createServerEmailTemplateBootstrapService():
  Promise<EmailTemplateBootstrapService> {
  const client =
    await createSupabaseServerClient();

  return new EmailTemplateBootstrapService(
    new SupabaseEmailTemplateRepository(
      client,
    ),
  );
}
