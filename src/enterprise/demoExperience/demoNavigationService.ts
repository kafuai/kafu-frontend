import type {
  DemoExperience,
  DemoExperienceSession,
  DemoExperienceStep,
} from "./demoExperienceTypes";

import type {
  DemoNavigationAccessResult,
} from "./demoNavigationTypes";

export class DemoNavigationService {
  evaluateAccess(
    experience: DemoExperience,
    session: DemoExperienceSession | null,
    pathname: string,
  ): DemoNavigationAccessResult {
    const orderedSteps =
      [...experience.steps].sort(
        (left, right) =>
          left.order - right.order,
      );

    const requestedStep =
      this.findStepByRoute(
        orderedSteps,
        pathname,
      );

    if (!session) {
      return {
        status: "no-session",
        requestedStep,
        currentStep: null,
        redirectRoute: "/demo-experience",
        session: null,
      };
    }

    const currentStep =
      session.currentStepId
        ? orderedSteps.find(
            (step) =>
              step.id === session.currentStepId,
          ) ?? null
        : null;

    const completedStepIds =
      new Set(
        session.progress
          .filter((item) => item.completed)
          .map((item) => item.stepId),
      );

    const experienceCompleted =
      orderedSteps.length > 0 &&
      orderedSteps.every((step) =>
        completedStepIds.has(step.id),
      );

    if (experienceCompleted) {
      return {
        status: "completed",
        requestedStep,
        currentStep: null,
        redirectRoute: null,
        session,
      };
    }

    if (!requestedStep) {
      return {
        status: "allowed",
        requestedStep: null,
        currentStep,
        redirectRoute: null,
        session,
      };
    }

    const requestedStepCompleted =
      completedStepIds.has(requestedStep.id);

    const requestedStepIsCurrent =
      currentStep?.id === requestedStep.id;

    if (
      requestedStepCompleted ||
      requestedStepIsCurrent
    ) {
      return {
        status: "allowed",
        requestedStep,
        currentStep,
        redirectRoute: null,
        session,
      };
    }

    return {
      status: "redirect",
      requestedStep,
      currentStep,
      redirectRoute:
        currentStep?.route ??
        "/demo-experience",
      session,
    };
  }

  findStepByRoute(
    steps: readonly DemoExperienceStep[],
    pathname: string,
  ): DemoExperienceStep | null {
    const normalizedPathname =
      this.normalizeRoute(pathname);

    return (
      steps.find(
        (step) =>
          this.normalizeRoute(step.route) ===
          normalizedPathname,
      ) ?? null
    );
  }

  getCurrentRoute(
    experience: DemoExperience,
    session: DemoExperienceSession,
  ): string {
    const currentStep =
      session.currentStepId
        ? experience.steps.find(
            (step) =>
              step.id === session.currentStepId,
          )
        : null;

    return (
      currentStep?.route ??
      "/demo-experience"
    );
  }

  private normalizeRoute(
    route: string,
  ): string {
    if (route === "/") {
      return route;
    }

    return route.replace(/\/+$/, "");
  }
}
