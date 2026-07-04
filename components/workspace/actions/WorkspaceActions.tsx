import Link from "next/link";

const actions = [
  {
    title: "Executive Journey",
    description: "Continue executive discovery and recommendations.",
    href: "/journey",
  },
  {
    title: "AI Modules",
    description: "Explore and activate company AI modules.",
    href: "/modules",
  },
  {
    title: "Digital Workforce",
    description: "Prepare digital employees for Phase 3.",
    href: "/digital-workforce",
  },
];

export default function WorkspaceActions() {
  return (
    <section className="grid gap-6 md:grid-cols-3">
      {actions.map((action) => (
        <Link
          key={action.href}
          href={action.href}
          className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
        >
          <h3 className="text-xl font-bold text-slate-900">
            {action.title}
          </h3>

          <p className="mt-3 text-slate-500">
            {action.description}
          </p>
        </Link>
      ))}
    </section>
  );
}