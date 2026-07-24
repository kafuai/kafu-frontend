import type {
  DemoExperienceRepository,
} from "./demoExperienceRepository";
import type {
  DemoExperience,
  DemoExperienceSession,
  DemoExperienceSummary,
} from "./demoExperienceTypes";

export interface StartDemoExperienceInput {
  readonly sessionId: string;
  readonly experienceKey: string;
  readonly userId: string;
  readonly companyId?: string;
}

export class DemoExperienceService {
  constructor(
    private readonly repository:
      DemoExperienceRepository,
  ) {}

  async startExperience(
    input: StartDemoExperienceInput,
  ): Promise<DemoExperienceSession> {
    const experience =
      await this.repository.getExperienceByKey(
        input.experienceKey,
      );

    if (!experience) {
      throw new Error(
        `Demo experience not found: ${input.experienceKey}`,
      );
    }

    if (experience.status !== "active") {
      throw new Error(
        `Demo experience is not active: ${input.experienceKey}`,
      );
    }

    const firstStep =
      [...experience.steps]
        .sort((left, right) =>
          left.order - right.order,
        )[0] ?? null;

    const now = new Date().toISOString();

    return this.repository.createSession({
      id: input.sessionId,
      experienceId: experience.id,
      userId: input.userId,
      companyId: input.companyId,
      currentStepId: firstStep?.id ?? null,
      progress: experience.steps.map(
        (step) => ({
          stepId: step.id,
          completed: false,
        }),
      ),
      startedAt: now,
    });
  }

  async getSession(
    sessionId: string,
  ): Promise<DemoExperienceSession | null> {
    return this.repository.getSession(
      sessionId,
    );
  }

  async completeStep(
    sessionId: string,
    stepId: string,
  ): Promise<DemoExperienceSession> {
    const session =
      await this.repository.getSession(
        sessionId,
      );

    if (!session) {
      throw new Error(
        `Demo session not found: ${sessionId}`,
      );
    }

    const experience =
      await this.repository.getExperienceById(
        session.experienceId,
      );

    if (!experience) {
      throw new Error(
        `Demo experience not found: ${session.experienceId}`,
      );
    }

    const stepExists =
      experience.steps.some(
        (step) => step.id === stepId,
      );

    if (!stepExists) {
      throw new Error(
        `Demo step not found: ${stepId}`,
      );
    }

    const now = new Date().toISOString();

    const progress =
      session.progress.map((item) =>
        item.stepId === stepId
          ? {
              ...item,
              completed: true,
              completedAt: now,
            }
          : item,
      );

    const orderedSteps =
      [...experience.steps].sort(
        (left, right) =>
          left.order - right.order,
      );

    const nextStep =
      orderedSteps.find((step) => {
        const stepProgress =
          progress.find(
            (item) =>
              item.stepId === step.id,
          );

        return !stepProgress?.completed;
      }) ?? null;

    const isCompleted =
      progress.every(
        (item) => item.completed,
      );

    return this.repository.updateSession({
      ...session,
      currentStepId: nextStep?.id ?? null,
      progress,
      completedAt: isCompleted
        ? now
        : undefined,
    });
  }

  summarize(
    experience: DemoExperience,
    session: DemoExperienceSession,
  ): DemoExperienceSummary {
    const completedStepIds =
      new Set(
        session.progress
          .filter((item) => item.completed)
          .map((item) => item.stepId),
      );

    const completedSteps =
      experience.steps.filter(
        (step) =>
          completedStepIds.has(step.id),
      ).length;

    const totalSteps =
      experience.steps.length;

    const estimatedMinutesRemaining =
      experience.steps
        .filter(
          (step) =>
            !completedStepIds.has(step.id),
        )
        .reduce(
          (total, step) =>
            total + step.estimatedMinutes,
          0,
        );

    return {
      totalSteps,
      completedSteps,
      progressPercentage:
        totalSteps === 0
          ? 0
          : Math.round(
              (completedSteps / totalSteps) *
                100,
            ),
      estimatedMinutesRemaining,
    };
  }
}

