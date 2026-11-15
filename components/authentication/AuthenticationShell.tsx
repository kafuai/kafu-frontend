"use client";

import type { ReactNode } from "react";

interface AuthenticationShellProps {
  readonly eyebrow: string;
  readonly title: string;
  readonly description: string;
  readonly children: ReactNode;
  readonly onBack?: () => void;
}

export default function AuthenticationShell({
  eyebrow,
  title,
  description,
  children,
  onBack,
}: AuthenticationShellProps) {
  return (
    <main
      dir="rtl"
      onClick={onBack}
      className="min-h-screen bg-slate-950 px-4 py-10 sm:px-6 lg:px-8 cursor-pointer"
    >
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-6xl items-center justify-center pointer-events-none">
        {/* البوكس فقط: تفعيل التفاعل وإيقاف الرجوع عند الضغط داخله */}
        <section 
          onClick={(e) => e.stopPropagation()}
          className="pointer-events-auto grid w-full overflow-hidden rounded-3xl border border-white/10 bg-white shadow-2xl lg:grid-cols-[1.05fr_0.95fr] cursor-default"
        >
          <div className="order-2 p-6 sm:p-10 lg:order-1 lg:p-14">
            {children}
          </div>

          <aside className="order-1 flex min-h-72 flex-col justify-between bg-slate-900 p-8 text-white sm:p-10 lg:order-2 lg:min-h-full lg:p-14">
            <div>
              <p className="text-sm font-bold tracking-[0.16em] text-emerald-400">
                {eyebrow}
              </p>

              <h1 className="mt-5 max-w-xl text-3xl font-black leading-tight sm:text-4xl">
                {title}
              </h1>

              <p className="mt-5 max-w-xl text-sm leading-7 text-slate-300 sm:text-base">
                {description}
              </p>
            </div>

            <div className="mt-12 border-t border-white/10 pt-6">
              <p className="text-sm font-semibold text-slate-200">
                KAFU AI Enterprise
              </p>

              <p className="mt-2 text-xs leading-6 text-slate-400">
                بيئة مؤسسية آمنة لإدارة المعرفة والقرارات
                والعمليات والاتصالات.
              </p>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}