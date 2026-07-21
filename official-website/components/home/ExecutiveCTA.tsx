import Link from "next/link";
import { ArrowRight, CalendarCheck2 } from "lucide-react";

export default function ExecutiveCTA() {
  return (
    <section id="contact" className="section-spacing bg-white">
      <div className="website-shell">
        <div className="relative overflow-hidden rounded-[30px] bg-[var(--brand-primary)] px-6 py-14 text-white shadow-[var(--shadow-lg)] sm:px-10 lg:px-16 lg:py-16">
          <div className="absolute -right-24 -top-28 h-72 w-72 rounded-full border-[60px] border-white/[0.055]" />
          <div className="absolute -bottom-24 left-[38%] h-64 w-64 rounded-full bg-white/[0.04] blur-2xl" />

          <div className="relative z-10 grid gap-10 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/12">
                <CalendarCheck2 size={22} />
              </div>

              <h2 className="text-balance mt-6 max-w-3xl text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">
                Identify the first high-value use case for your organization.
              </h2>

              <p className="mt-5 max-w-2xl text-base leading-8 text-white/80">
                Begin with an executive discovery session focused on your
                priorities, operating environment and measurable transformation
                outcomes.
              </p>
            </div>

            <Link
              href="mailto:hello@kafu.ai?subject=KAFU%20AI%20Executive%20Demo"
              className="inline-flex min-h-13 items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-semibold text-[var(--brand-primary-strong)] shadow-xl transition hover:-translate-y-0.5 hover:bg-slate-100"
            >
              Request Executive Demo
              <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
