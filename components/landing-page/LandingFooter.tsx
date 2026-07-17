import Link from "next/link";

const COPYRIGHT_YEAR = 2026;

export function LandingFooter() {
  return (
    <footer className="border-t border-white/10 bg-slate-950 px-6 py-10 lg:px-10">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xl font-semibold text-white">KAFU AI</p>

          <p className="mt-2 text-sm text-slate-500">
            Enterprise Intelligence &amp; Execution Platform
          </p>
        </div>

        <nav className="flex flex-wrap gap-5 text-sm text-slate-400">
          <Link href="/welcome" className="transition hover:text-white">
            ابدأ التجربة
          </Link>

          <Link
            href="/executive-summary"
            className="transition hover:text-white"
          >
            Executive Demo
          </Link>

          <Link href="/company-profile" className="transition hover:text-white">
            Company Profile
          </Link>
        </nav>

        <p className="text-sm text-slate-600">
          © {COPYRIGHT_YEAR} KAFU AI
        </p>
      </div>
    </footer>
  );
}
