import {
  createSupabaseBrowserClient,
} from "../../../lib/supabase-auth/browser";

import {
  DemoExperienceService,
} from "./demoExperienceService";
import {
  SupabaseDemoExperienceRepository,
} from "./supabaseDemoExperienceRepository";

let browserDemoExperienceService:
  DemoExperienceService | null = null;

export function getBrowserDemoExperienceService():
  DemoExperienceService {
  if (!browserDemoExperienceService) {
    const client =
      createSupabaseBrowserClient();

    browserDemoExperienceService =
      new DemoExperienceService(
        new SupabaseDemoExperienceRepository(
          client,
        ),
      );
  }

  return browserDemoExperienceService;
}
