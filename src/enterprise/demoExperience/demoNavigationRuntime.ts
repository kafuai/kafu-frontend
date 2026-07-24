import {
  getBrowserAuthenticationService,
} from "../authentication/authenticationRuntime";

import {
  enterpriseDemoExperience,
} from "./enterpriseDemoExperienceCatalog";
import {
  getBrowserDemoExperienceService,
} from "./demoExperienceRuntime";
import {
  DemoNavigationService,
} from "./demoNavigationService";

import type {
  DemoNavigationAccessResult,
} from "./demoNavigationTypes";

let browserDemoNavigationService:
  DemoNavigationService | null = null;

export function getBrowserDemoNavigationService():
  DemoNavigationService {
  if (!browserDemoNavigationService) {
    browserDemoNavigationService =
      new DemoNavigationService();
  }

  return browserDemoNavigationService;
}

export async function resolveBrowserDemoNavigation(
  pathname: string,
): Promise<DemoNavigationAccessResult> {
  const authenticationService =
    getBrowserAuthenticationService();

  const demoExperienceService =
    getBrowserDemoExperienceService();

  const demoNavigationService =
    getBrowserDemoNavigationService();

  const identity =
    await authenticationService.getIdentity();

  if (!identity) {
    return demoNavigationService.evaluateAccess(
      enterpriseDemoExperience,
      null,
      pathname,
    );
  }

  const storageKey =
    `kafu-demo-session:${identity.user.id}:${enterpriseDemoExperience.key}`;

  const sessionId =
    window.localStorage.getItem(storageKey);

  if (!sessionId) {
    return demoNavigationService.evaluateAccess(
      enterpriseDemoExperience,
      null,
      pathname,
    );
  }

  const session =
    await demoExperienceService.getSession(
      sessionId,
    );

  if (!session) {
    window.localStorage.removeItem(storageKey);
  }

  return demoNavigationService.evaluateAccess(
    enterpriseDemoExperience,
    session,
    pathname,
  );
}
