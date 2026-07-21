import {
  BadgeCheck,
  KeyRound,
  Scale,
  ShieldCheck,
} from "lucide-react";

const trustItems = [
  {
    icon: ShieldCheck,
    title: "Governed by Design",
    description:
      "AI use remains aligned with approved organizational authority, policies and responsibilities.",
  },
  {
    icon: KeyRound,
    title: "Controlled Access",
    description:
      "Enterprise knowledge and capabilities are made available according to defined access boundaries.",
  },
  {
    icon: Scale,
    title: "Human Accountability",
    description:
      "KAFU AI supports leadership judgment while executive authority remains with the organization.",
  },
  {
    icon: BadgeCheck,
    title: "Measured Adoption",
    description:
      "Each implementation begins with a focused outcome and expands according to validated value.",
  },
];

export default function EnterpriseTrustSection() {
  return (
    <section
      id="enterprise"
      className="section-spacing overflow-hidden bg-[#071321] text-white"
    >
      <div className="website-shell">
        <div className="grid gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#69d1d5]">
              Enterprise Trust
            </p>

            <h2 className="text-balance mt-5 text-3xl font-semibold tracking-[-0.035em] sm:text-4xl lg:text-5xl">
              Enterprise AI requires more than intelligence.
            </h2>

            <p className="mt-6 max-w-xl text-base leading-8 text-slate-300">
              It requires governance, access control, accountability and a
              controlled path from experimentation to organizational adoption.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {trustItems.map((item) => {
              const Icon = item.icon;

              return (
                <article
                  key={item.title}
                  className="rounded-[22px] border border-white/10 bg-white/[0.055] p-6"
                >
                  <Icon size={21} className="text-[#69d1d5]" />
                  <h3 className="mt-5 font-semibold">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-400">
                    {item.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
