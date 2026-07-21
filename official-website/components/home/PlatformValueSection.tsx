import {
  BrainCircuit,
  ChartNoAxesCombined,
  CircleCheckBig,
} from "lucide-react";

const valueItems = [
  {
    icon: BrainCircuit,
    metric: "Knowledge",
    title: "Understand the organization",
    description:
      "Bring relevant context, institutional knowledge and executive priorities into one intelligence environment.",
  },
  {
    icon: ChartNoAxesCombined,
    metric: "Decisions",
    title: "Clarify what matters",
    description:
      "Highlight strategic implications, risks, recommendations and the decisions requiring leadership attention.",
  },
  {
    icon: CircleCheckBig,
    metric: "Execution",
    title: "Coordinate what happens next",
    description:
      "Connect approved priorities with ownership, action, progress and AI-assisted enterprise workflows.",
  },
];

export default function PlatformValueSection() {
  return (
    <section id="platform" className="section-spacing">
      <div className="website-shell">
        <div className="grid gap-12 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--brand-primary)]">
              The KAFU AI Platform
            </p>

            <h2 className="text-balance mt-5 text-3xl font-semibold tracking-[-0.035em] sm:text-4xl lg:text-5xl">
              Intelligence built around the enterprise.
            </h2>

            <p className="mt-6 text-base leading-8 text-[var(--text-secondary)]">
              KAFU AI begins with organizational context and connects it to
              leadership decisions and coordinated execution.
            </p>
          </div>

          <div className="grid gap-4">
            {valueItems.map((item) => {
              const Icon = item.icon;

              return (
                <article
                  key={item.metric}
                  className="grid gap-5 rounded-[24px] border border-[var(--border-default)] bg-white p-6 shadow-[var(--shadow-sm)] sm:grid-cols-[52px_1fr]"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--brand-subtle)] text-[var(--brand-primary)]">
                    <Icon size={21} />
                  </div>

                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.15em] text-[var(--brand-primary)]">
                      {item.metric}
                    </p>
                    <h3 className="mt-2 text-lg font-semibold">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm leading-7 text-[var(--text-secondary)]">
                      {item.description}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
