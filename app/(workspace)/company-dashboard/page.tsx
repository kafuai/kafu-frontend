"use client";

import Link from "next/link";

export default function CompanyDashboardPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="mx-auto max-w-7xl">
        <p className="text-sm font-semibold text-slate-500">
          KAFU AI Company Dashboard
        </p>

        <h1 className="mt-2 text-3xl font-bold text-slate-900">
          لوحة قيادة الشركة
        </h1>

        <p className="mt-3 max-w-3xl text-slate-600">
          هذه الصفحة ستكون مركز متابعة حالة الشركة، التشخيص، الوحدات، وفريق العمل الرقمي.
        </p>

        <div className="mt-8 grid gap-6 md:grid-cols-4">
          <div className="rounded-2xl border bg-white p-6">
            <p className="text-sm text-slate-500">Company Status</p>
            <h2 className="mt-2 text-2xl font-bold">Active</h2>
          </div>

          <div className="rounded-2xl border bg-white p-6">
            <p className="text-sm text-slate-500">Executive Journey</p>
            <h2 className="mt-2 text-2xl font-bold">In Progress</h2>
          </div>

          <div className="rounded-2xl border bg-white p-6">
            <p className="text-sm text-slate-500">AI Modules</p>
            <h2 className="mt-2 text-2xl font-bold">3</h2>
          </div>

          <div className="rounded-2xl border bg-white p-6">
            <p className="text-sm text-slate-500">Digital Workforce</p>
            <h2 className="mt-2 text-2xl font-bold">Coming Soon</h2>
          </div>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <Link
            href="/company-workspace"
            className="rounded-2xl border bg-white p-6 hover:shadow-lg transition"
          >
            <h2 className="text-xl font-bold">Workspace</h2>
            <p className="mt-3 text-slate-600">
              العودة إلى مساحة عمل الشركة.
            </p>
          </Link>

          <Link
            href="/journey"
            className="rounded-2xl border bg-white p-6 hover:shadow-lg transition"
          >
            <h2 className="text-xl font-bold">Executive Journey</h2>
            <p className="mt-3 text-slate-600">
              متابعة مرحلة التشخيص التنفيذي.
            </p>
          </Link>

          <Link
            href="/modules"
            className="rounded-2xl border bg-white p-6 hover:shadow-lg transition"
          >
            <h2 className="text-xl font-bold">AI Modules</h2>
            <p className="mt-3 text-slate-600">
              إدارة وحدات الذكاء الاصطناعي.
            </p>
          </Link>
        </div>
      </div>
    </main>
  );
}