import Link from "next/link";
import { ArrowUpRight, Menu } from "lucide-react";

const navigation = [
  { label: "Platform", href: "#platform" },
  { label: "Capabilities", href: "#capabilities" },
  { label: "Transformation", href: "#transformation" },
  { label: "Enterprise", href: "#enterprise" },
];

export default function WebsiteHeader() {
  return (
    <header className="absolute inset-x-0 top-0 z-50 border-b border-white/10 bg-[#071321]/70 backdrop-blur-xl">
      <div className="website-shell flex h-[76px] items-center justify-between gap-8">
        <Link
          href="/"
          className="flex items-center gap-3"
          aria-label="KAFU AI home"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-white/10 text-sm font-bold tracking-[0.16em] text-white shadow-lg">
            K
          </span>

          <span>
            <span className="block text-[15px] font-semibold tracking-[0.2em] text-white">
              KAFU AI
            </span>
            <span className="hidden text-[10px] font-medium uppercase tracking-[0.14em] text-slate-400 sm:block">
              Enterprise Intelligence
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex" aria-label="Primary">
          {navigation.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-sm font-medium text-slate-300 transition hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="#contact"
            className="hidden items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white transition hover:border-white/25 hover:bg-white/15 sm:inline-flex"
          >
            Book Executive Demo
            <ArrowUpRight size={16} />
          </Link>

          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-white/10 text-white lg:hidden"
            aria-label="Open navigation"
          >
            <Menu size={19} />
          </button>
        </div>
      </div>
    </header>
  );
}
