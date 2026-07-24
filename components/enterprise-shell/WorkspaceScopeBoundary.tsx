"use client";

import {
  AlertTriangle,
  Building2,
  LoaderCircle,
} from "lucide-react";
import type {
  ReactNode,
} from "react";

import { useWorkspaceScope } from "@/hooks/useWorkspaceScope";

type WorkspaceScopeBoundaryProps = {
  children: ReactNode;
  companyOnly?: boolean;
  loadingLabel?: string;
};

export default function WorkspaceScopeBoundary({
  children,
  companyOnly = false,
  loadingLabel = "جارٍ تحميل مساحة العمل",
}: WorkspaceScopeBoundaryProps) {
  const {
    scope,
    isLoading,
    error,
    isPortfolio,
  } = useWorkspaceScope();

  if (isLoading) {
    return (
      <main className="min-h-[70vh] bg-[var(--background)] px-5 py-10">
        <section className="mx-auto flex max-w-7xl items-center justify-center rounded-[22px] border border-[var(--border-default)] bg-[var(--surface)] p-10 shadow-[var(--shadow-small)]">
          <div className="flex items-center gap-3 text-sm font-bold text-[var(--text-secondary)]">
            <LoaderCircle className="h-5 w-5 animate-spin text-[var(--brand-primary)]" />

            <span>{loadingLabel}</span>
          </div>
        </section>
      </main>
    );
  }

  if (error || !scope) {
    return (
      <main className="min-h-[70vh] bg-[var(--background)] px-5 py-10">
        <section className="mx-auto max-w-3xl rounded-[22px] border border-red-200 bg-red-50 p-8 shadow-[var(--shadow-small)]">
          <div className="flex items-start gap-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-red-100 text-red-700">
              <AlertTriangle className="h-5 w-5" />
            </span>

            <div>
              <h1 className="text-lg font-black text-slate-950">
                تعذر تحميل مساحة العمل
              </h1>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                {error ??
                  "لم نتمكن من التحقق من صلاحيات مساحة العمل الحالية."}
              </p>
            </div>
          </div>
        </section>
      </main>
    );
  }

  if (companyOnly && isPortfolio) {
    return (
      <main className="min-h-[70vh] bg-[var(--background)] px-5 py-10">
        <section className="mx-auto max-w-3xl rounded-[22px] border border-[var(--border-default)] bg-[var(--surface)] p-8 shadow-[var(--shadow-small)]">
          <div className="flex items-start gap-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[var(--brand-subtle)] text-[var(--brand-primary)]">
              <Building2 className="h-5 w-5" />
            </span>

            <div>
              <h1 className="text-lg font-black text-[var(--text-primary)]">
                اختر شركة محددة
              </h1>

              <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
                هذه الصفحة تعرض بيانات شركة واحدة فقط.
                اختر الشركة المطلوبة من محدد مساحات العمل
                الموجود في أعلى الصفحة.
              </p>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return children;
}
