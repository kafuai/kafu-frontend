"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  enterpriseDemoExperience,
} from "../../src/enterprise/demoExperience/enterpriseDemoExperienceCatalog";

const demoRoutes = new Set(
  enterpriseDemoExperience.steps.map(
    (step) => step.route,
  ),
);

export default function DemoExperienceNavigationBar() {
  const pathname = usePathname();

  if (!demoRoutes.has(pathname)) {
    return null;
  }

  const currentStep =
    enterpriseDemoExperience.steps.find(
      (step) => step.route === pathname,
    );

  return (
    <aside
      dir="rtl"
      aria-label="التنقل في العرض التجريبي"
      className="sticky top-0 z-40 border-b border-emerald-200 bg-emerald-50/95 px-4 py-3 shadow-sm backdrop-blur sm:px-6 lg:px-8"
    >
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-black text-emerald-700">
            رحلة KAFU AI التجريبية
          </p>

          {currentStep ? (
            <p className="mt-1 truncate text-sm font-bold text-slate-700">
              الخطوة الحالية: {currentStep.title}
            </p>
          ) : null}
        </div>

        <Link
          href="/demo-experience"
          className="inline-flex min-h-10 items-center justify-center rounded-xl border border-emerald-300 bg-white px-4 text-sm font-black text-emerald-800 shadow-sm transition hover:border-emerald-400 hover:bg-emerald-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
        >
          العودة إلى رحلة العرض
        </Link>
      </div>
    </aside>
  );
}
