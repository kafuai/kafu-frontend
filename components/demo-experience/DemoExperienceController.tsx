"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  getBrowserAuthenticationService,
} from "../../src/enterprise/authentication/authenticationRuntime";
import {
  getBrowserDemoExperienceService,
} from "../../src/enterprise/demoExperience/demoExperienceRuntime";
import type {
  DemoExperience,
  DemoExperienceSession,
} from "../../src/enterprise/demoExperience/demoExperienceTypes";

import DemoExperienceProgress from "./DemoExperienceProgress";

interface DemoExperienceControllerProps {
  readonly experience: DemoExperience;
}

function createSessionId(): string {
  return crypto.randomUUID();
}

export default function DemoExperienceController({
  experience,
}: DemoExperienceControllerProps) {
  const authenticationService = useMemo(
    () => getBrowserAuthenticationService(),
    [],
  );

  const demoExperienceService = useMemo(
    () => getBrowserDemoExperienceService(),
    [],
  );

  const [session, setSession] =
    useState<DemoExperienceSession | null>(null);

  const [isLoading, setIsLoading] =
    useState(true);

  const [isStarting, setIsStarting] =
    useState(false);

  const [
    completingStepId,
    setCompletingStepId,
  ] = useState<string | null>(null);

  const [errorMessage, setErrorMessage] =
    useState("");

  useEffect(() => {
    let active = true;

    async function loadStoredSession() {
      try {
        const identity =
          await authenticationService.getIdentity();

        if (!active || !identity) {
          return;
        }

        const storageKey =
          `kafu-demo-session:${identity.user.id}:${experience.key}`;

        const storedSessionId =
          window.localStorage.getItem(
            storageKey,
          );

        if (!storedSessionId) {
          return;
        }

        const storedSession =
          await demoExperienceService.getSession(
            storedSessionId,
          );

        if (active) {
          setSession(storedSession);
        }
      } catch (error) {
        if (active) {
          setErrorMessage(
            error instanceof Error
              ? error.message
              : "تعذر تحميل جلسة العرض التجريبي.",
          );
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    }

    void loadStoredSession();

    return () => {
      active = false;
    };
  }, [
    authenticationService,
    demoExperienceService,
    experience.key,
  ]);

  async function startDemoExperience() {
    setIsStarting(true);
    setErrorMessage("");

    try {
      const identity =
        await authenticationService.getIdentity();

      if (!identity) {
        throw new Error(
          "يجب تسجيل الدخول لبدء العرض التجريبي.",
        );
      }

      const createdSession =
        await demoExperienceService.startExperience({
          sessionId: createSessionId(),
          experienceKey: experience.key,
          userId: identity.user.id,
        });

      window.localStorage.setItem(
        `kafu-demo-session:${identity.user.id}:${experience.key}`,
        createdSession.id,
      );

      setSession(createdSession);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "تعذر بدء العرض التجريبي.",
      );
    } finally {
      setIsStarting(false);
    }
  }

  async function completeStep(
    stepId: string,
  ) {
    if (!session) {
      return;
    }

    setCompletingStepId(stepId);
    setErrorMessage("");

    try {
      const updatedSession =
        await demoExperienceService.completeStep(
          session.id,
          stepId,
        );

      setSession(updatedSession);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "تعذر حفظ تقدم الخطوة.",
      );
    } finally {
      setCompletingStepId(null);
    }
  }

  if (isLoading) {
    return (
      <div
        dir="rtl"
        className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm"
      >
        <p className="font-bold text-slate-700">
          جارٍ تحميل رحلة العرض التجريبي...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {!session ? (
        <section
          dir="rtl"
          className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
        >
          <p className="text-sm font-bold text-emerald-700">
            KAFU AI ENTERPRISE DEMO
          </p>

          <h1 className="mt-3 text-2xl font-black text-slate-950 sm:text-3xl">
            ابدأ رحلة العرض التجريبي المؤسسية
          </h1>

          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">
            سيتم حفظ تقدمك تلقائيًا وربط الجلسة
            بحسابك للمتابعة من آخر خطوة.
          </p>

          <button
            type="button"
            onClick={startDemoExperience}
            disabled={isStarting}
            className="mt-6 inline-flex min-h-12 items-center justify-center rounded-xl bg-slate-950 px-6 text-sm font-black text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isStarting
              ? "جارٍ بدء الرحلة..."
              : "بدء العرض التجريبي"}
          </button>
        </section>
      ) : null}

      {errorMessage ? (
        <div
          dir="rtl"
          className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-bold text-red-700"
        >
          {errorMessage}
        </div>
      ) : null}

      <DemoExperienceProgress
        experience={experience}
        session={session}
        completingStepId={completingStepId}
        onCompleteStep={completeStep}
      />
    </div>
  );
}

