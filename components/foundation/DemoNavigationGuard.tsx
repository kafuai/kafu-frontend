"use client";

import {
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  usePathname,
  useRouter,
} from "next/navigation";

import {
  enterpriseDemoExperience,
} from "../../src/enterprise/demoExperience/enterpriseDemoExperienceCatalog";
import {
  resolveBrowserDemoNavigation,
} from "../../src/enterprise/demoExperience/demoNavigationRuntime";

interface DemoNavigationGuardProps {
  readonly children: ReactNode;
}

const demoRoutes = new Set(
  enterpriseDemoExperience.steps.map(
    (step) => step.route,
  ),
);

export default function DemoNavigationGuard({
  children,
}: DemoNavigationGuardProps) {
  const pathname = usePathname();
  const router = useRouter();

  const isDemoRoute = useMemo(
    () => demoRoutes.has(pathname),
    [pathname],
  );

  const [isChecking, setIsChecking] =
    useState(isDemoRoute);

  useEffect(() => {
    let active = true;

    async function validateNavigation() {
      if (!isDemoRoute) {
        setIsChecking(false);
        return;
      }

      setIsChecking(true);

      try {
        const result =
          await resolveBrowserDemoNavigation(
            pathname,
          );

        if (!active) {
          return;
        }

        if (
          result.status === "redirect" ||
          result.status === "no-session"
        ) {
          router.replace(
            result.redirectRoute ??
              "/demo-experience",
          );

          return;
        }

        setIsChecking(false);
      } catch {
        if (!active) {
          return;
        }

        router.replace("/demo-experience");
      }
    }

    void validateNavigation();

    return () => {
      active = false;
    };
  }, [
    isDemoRoute,
    pathname,
    router,
  ]);

  if (isChecking) {
    return (
      <main
        dir="rtl"
        className="flex min-h-[calc(100vh-76px)] items-center justify-center bg-[var(--background)] px-6"
      >
        <div
          role="status"
          aria-live="polite"
          className="rounded-3xl border border-[var(--border-default)] bg-[var(--surface)] p-10 text-center shadow-[var(--shadow-medium)]"
        >
          <span className="mx-auto block h-10 w-10 animate-spin rounded-full border-4 border-[var(--border-default)] border-t-[var(--brand-primary)]" />

          <p className="mt-5 font-bold text-[var(--text-primary)]">
            جارٍ التحقق من مسار العرض التجريبي...
          </p>
        </div>
      </main>
    );
  }

  return children;
}
