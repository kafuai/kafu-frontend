import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const links = [
  { label: "Platform", href: "#platform" },
  { label: "Capabilities", href: "#capabilities" },
  { label: "Transformation", href: "#transformation" },
  { label: "Enterprise", href: "#enterprise" },
];

export default function WebsiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-[#071321] text-white">
      <div className="website-shell py-14">
        <div className="grid gap-12 border-b border-white/10 pb-12 lg:grid-cols-[1.3fr_0.7fr_0.7fr]">
          <div>
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/15 bg-white/10 text-sm font-bold tracking-[0.16em]">
                K
              </span>

              <div>
                <p className="font-semibold tracking-[0.2em]">KAFU AI</p>
                <p className="mt-1 text-xs uppercase tracking-[0.13em] text-slate-400">
                  Enterprise Intelligence Platform
                </p>
              </div>
            </div>

            <p className="mt-6 max-w-xl text-sm leading-7 text-slate-400">
              Transform organizational knowledge into executive clarity,
              governed decisions and coordinated AI execution.
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
              Explore
            </p>

            <div className="mt-5 flex flex-col gap-3">
              {links.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-sm text-slate-300 transition hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
              Engagement
            </p>

            <Link
              href="#contact"
              className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-white"
            >
              Book Executive Demo
              <ArrowUpRight size={16} />
            </Link>

            <p className="mt-4 text-sm leading-6 text-slate-400">
              Executive discovery, enterprise assessment and controlled
              implementation.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3 pt-7 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 KAFU AI. All rights reserved.</p>
          <p>Enterprise intelligence. Executive clarity. Coordinated execution.</p>
        </div>
      </div>
    </footer>
  );
}
