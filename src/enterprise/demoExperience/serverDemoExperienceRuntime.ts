import {
  createSupabaseServerClient,
} from "../../../lib/supabase-auth/server";

import {
  DemoExperienceBootstrapService,
} from "./demoExperienceBootstrapService";
import {
  DemoExperienceService,
} from "./demoExperienceService";
import {
  SupabaseDemoExperienceRepository,
} from "./supabaseDemoExperienceRepository";

export async function createServerDemoExperienceService():
  Promise<DemoExperienceService> {
  const client =
    await createSupabaseServerClient();

  return new DemoExperienceService(
    new SupabaseDemoExperienceRepository(
      client,
    ),
  );
}

export async function createServerDemoExperienceBootstrapService():
  Promise<DemoExperienceBootstrapService> {
  const client =
    await createSupabaseServerClient();

  return new DemoExperienceBootstrapService(
    new SupabaseDemoExperienceRepository(
      client,
    ),
  );
}
