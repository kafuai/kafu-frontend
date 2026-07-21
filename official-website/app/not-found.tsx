import Link from "next/link";
import { ArrowLeft, Home } from "lucide-react";

import WebsiteFooter from "@/components/layout/WebsiteFooter";
import WebsiteHeader from "@/components/layout/WebsiteHeader";

export default function NotFound() {
  return (
    <>
      <WebsiteHeader />

      <main className="flex min-h-[72vh] items-center bg-[var(--surface-soft)] pb-20 pt-36">
        <div className="website-shell">
          <div className="mx-auto max-w-2xl rounded-[28px] border border-[var(--border-default)] bg-white p-8 text-center shadow-[var(--shadow-md)] sm:p-12">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--brand-primary)]">
              Error 404
            </p>

            <h1 className="mt-5 text-4xl font-semibold tracking-[-0.04em] text-[var(--text-primary)] sm:text-5xl">
              This page could not be found.
            </h1>

            <p className="mx-auto mt-5 max-w-lg text-base leading-8 text-[var(--text-secondary)]">
              The address may be incorrect, or the page may have moved. Return
              to the KAFU AI website to continue exploring the platform.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href="/"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[var(--brand-primary)] px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5"
              >
                <Home size={17} />
                Return Home
              </Link>

              <Link
                href="/platform"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-[var(--border-default)] bg-white px-6 py-3 text-sm font-semibold text-[var(--text-primary)] transition hover:border-[var(--border-strong)]"
              >
                <ArrowLeft size={17} />
                Explore Platform
              </Link>
            </div>
          </div>
        </div>
      </main>

      <WebsiteFooter />
    </>
  );
}