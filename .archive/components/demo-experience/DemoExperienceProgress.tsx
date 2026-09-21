"use client";

import Link from "next/link";

import type {
  DemoExperience,
  DemoExperienceSession,
} from "../../src/enterprise/demoExperience/demoExperienceTypes";

interface DemoExperienceProgressProps {
  readonly experience: DemoExperience;
  readonly session?: DemoExperienceSession | null;
  readonly completingStepId?: string | null;
  readonly onCompleteStep?: (
    stepId: string,
  ) => Promise<void>;
}

export default function DemoExperienceProgress({
  experience,
  session,
  completingStepId = null,
  onCompleteStep,
}: DemoExperienceProgressProps) {
  const completedStepIds = new Set(
    session?.progress
      .filter((item) => item.completed)
      .map((item) => item.stepId) ?? [],
  );

  const orderedSteps = [...experience.steps].sort(
    (left, right) => left.order - right.order,
  );

  const completedSteps = completedStepIds.size;

  const progressPercentage =
    orderedSteps.length === 0
      ? 0
      : Math.round(
          (completedSteps / orderedSteps.length) * 100,
        );

  const experienceCompleted =
    orderedSteps.length > 0 &&
    completedSteps === orderedSteps.length;

  return (
    <section
      dir="rtl"
      className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
    >
      <div className="border-b border-slate-200 px-6 py-6 sm:px-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-bold tracking-wide text-emerald-700">
              KAFU AI ENTERPRISE DEMO
            </p>

            <h1 className="mt-2 text-2xl font-black text-slate-950 sm:text-3xl">
              {experience.name}
            </h1>

            <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">
              {experience.description}
            </p>
          </div>

          <div className="min-w-48 rounded-2xl bg-slate-950 px-5 py-4 text-white">
            <div className="flex items-center justify-between gap-6">
              <span className="text-sm text-slate-300">
                التقدم
              </span>

              <strong className="text-2xl">
                {progressPercentage}%
              </strong>
            </div>

            <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-700">
              <div
                className="h-full rounded-full bg-emerald-400 transition-all"
                style={{
                  width: `${progressPercentage}%`,
                }}
              />
            </div>
          </div>
        </div>

        {experienceCompleted ? (
          <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4">
            <p className="font-black text-emerald-900">
              تم إكمال رحلة العرض التجريبي بنجاح.
            </p>

            <p className="mt-1 text-sm leading-6 text-emerald-700">
              أصبحت جميع خطوات العرض مكتملة ومسجلة في جلستك.
            </p>
          </div>
        ) : null}
      </div>

      <div className="grid gap-px bg-slate-200 lg:grid-cols-2">
        {orderedSteps.map((step) => {
          const completed =
            completedStepIds.has(step.id);

          const active =
            session?.currentStepId === step.id ||
            (!session && step.order === 1);

          const isCompleting =
            completingStepId === step.id;

          const completionEnabled =
            Boolean(
              session &&
              onCompleteStep &&
              active &&
              !completed,
            );

          return (
            <article
              key={step.id}
              className="bg-white p-6 sm:p-7"
            >
              <div className="flex items-start gap-4">
                <div
                  className={[
                    "flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-sm font-black",
                    completed
                      ? "bg-emerald-100 text-emerald-800"
                      : active
                        ? "bg-slate-950 text-white"
                        : "bg-slate-100 text-slate-500",
                  ].join(" ")}
                >
                  {completed ? "✓" : step.order}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-lg font-black text-slate-950">
                      {step.title}
                    </h2>

                    {active && !completed ? (
                      <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800">
                        الخطوة الحالية
                      </span>
                    ) : null}

                    {completed ? (
                      <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
                        مكتملة
                      </span>
                    ) : null}
                  </div>

                  <p className="mt-2 text-sm leading-7 text-slate-600">
                    {step.description}
                  </p>

                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                    <span className="text-xs font-bold text-slate-400">
                      {step.estimatedMinutes} دقائق
                    </span>

                    <div className="flex flex-wrap items-center gap-2">
                      <Link
                        href={step.route}
                        className="inline-flex items-center justify-center rounded-xl border border-slate-200 px-4 py-2 text-sm font-bold text-slate-700 transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-800"
                      >
                        فتح الخطوة
                      </Link>

                      {completionEnabled ? (
                        <button
                          type="button"
                          disabled={isCompleting}
                          onClick={() =>
                            void onCompleteStep?.(
                              step.id,
                            )
                          }
                          className="inline-flex items-center justify-center rounded-xl bg-slate-950 px-4 py-2 text-sm font-black text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {isCompleting
                            ? "جارٍ الحفظ..."
                            : "إكمال الخطوة"}
                        </button>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
