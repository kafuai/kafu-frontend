import Link from "next/link";

const workspaceLinks = [
  { title: "🏠 Workspace", href: "/company-workspace", active: true },
  { title: "📊 Company Dashboard", href: "/company-dashboard" },
  { title: "🧭 Executive Journey", href: "/journey" },
];

const aiLinks = [
  { title: "🤖 AI Modules", href: "/modules" },
  { title: "🧠 Corporate Brain", href: "/corporate-brain" },
];

const operationsLinks = [
  { title: "👥 Digital Workforce", href: "/digital-workforce" },
  { title: "⚡ Command Center", href: "/command-center" },
];

function SidebarSection({
  title,
  links,
}: {
  title: string;
  links: { title: string; href: string; active?: boolean }[];
}) {
  return (
    <div className="space-y-2">
      <p className="px-4 text-xs font-bold uppercase tracking-wider text-slate-400">
        {title}
      </p>

      {links.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`block rounded-2xl px-4 py-3 text-sm font-semibold transition ${
            item.active
              ? "bg-slate-900 text-white shadow"
              : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
          }`}
        >
          {item.title}
        </Link>
      ))}
    </div>
  );
}

export default function WorkspaceSidebar() {
  return (
    <aside className="sticky top-6 flex h-[calc(100vh-3rem)] w-64 flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900">KAFU AI</h1>
        <p className="mt-2 text-sm text-slate-500">
          Company Operating System
        </p>
      </div>

      <div className="mb-6 rounded-2xl bg-slate-50 p-4">
        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Active Company
        </p>

        <p className="mt-2 font-bold text-slate-900">
          شركة الفراشة الزرقاء
        </p>

        <p className="mt-1 text-sm text-slate-500">
          75 Employees · Saudi Arabia
        </p>
      </div>

      <nav className="flex-1 space-y-6 overflow-y-auto">
        <SidebarSection title="Workspace" links={workspaceLinks} />
        <SidebarSection title="AI" links={aiLinks} />
        <SidebarSection title="Operations" links={operationsLinks} />
      </nav>

      <div className="mt-6 rounded-2xl bg-slate-900 p-4 text-white">
        <p className="text-sm font-semibold">Phase 2</p>
        <p className="mt-1 text-xs text-slate-300">
          Workspace UI in progress.
        </p>
      </div>
    </aside>
  );
}