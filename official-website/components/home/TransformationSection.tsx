import { ArrowRight, CheckCircle2 } from "lucide-react";

const transformationSteps = [
  {
    number: "01",
    title: "Discover",
    description:
      "Capture executive priorities, operating challenges and organizational context.",
  },
  {
    number: "02",
    title: "Understand",
    description:
      "Structure enterprise knowledge and identify the highest-value decision areas.",
  },
  {
    number: "03",
    title: "Decide",
    description:
      "Translate context into recommendations, risks, priorities and clear executive choices.",
  },
  {
    number: "04",
    title: "Execute",
    description:
      "Connect approved priorities with responsible teams, workflows and digital workers.",
  },
  {
    number: "05",
    title: "Govern",
    description:
      "Maintain visibility, accountability and continuous executive reporting.",
  },
];

export default function TransformationSection() {
  return (
    <section
      id="transformation"
      className="section-spacing bg-[var(--surface-soft)]"
    >
      <div className="website-shell">
        <div className="grid gap-14 lg:grid-cols-[0.78fr_1.22fr]">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--brand-primary)]">
              Enterprise Transformation Journey
            </p>

            <h2 className="text-balance mt-5 text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">
              Move from scattered information to coordinated execution.
            </h2>

            <p className="mt-6 text-base leading-8 text-[var(--text-secondary)]">
              KAFU AI creates one connected journey from executive discovery to
              institutional intelligence, decisions and measurable action.
            </p>

            <div className="mt-8 rounded-2xl border border-[var(--border-default)] bg-white p-6 shadow-[var(--shadow-sm)]">
              <p className="text-sm font-semibold text-[var(--text-primary)]">
                Designed for controlled enterprise adoption
              </p>

              <div className="mt-4 space-y-3">
                {[
                  "Start with one high-value use case",
                  "Define governance and measurable outcomes",
                  "Expand according to demonstrated value",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-3 text-sm leading-6 text-[var(--text-secondary)]"
                  >
                    <CheckCircle2
                      size={17}
                      className="mt-1 shrink-0 text-[var(--brand-primary)]"
                    />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {transformationSteps.map((step, index) => (
              <article
                key={step.number}
                className="group grid gap-4 rounded-2xl border border-[var(--border-default)] bg-white p-5 shadow-[var(--shadow-sm)] transition hover:border-[var(--border-strong)] md:grid-cols-[64px_1fr_32px] md:items-center"
              >
                <span className="text-sm font-bold tracking-[0.12em] text-[var(--brand-primary)]">
                  {step.number}
                </span>

                <div>
                  <h3 className="font-semibold text-[var(--text-primary)]">
                    {step.title}
                  </h3>
                  <p className="mt-1 text-sm leading-6 text-[var(--text-secondary)]">
                    {step.description}
                  </p>
                </div>

                <ArrowRight
                  size={18}
                  className="hidden text-[var(--text-muted)] transition group-hover:translate-x-1 group-hover:text-[var(--brand-primary)] md:block"
                />

                {index < transformationSteps.length - 1 && (
                  <span className="sr-only">
                    Followed by {transformationSteps[index + 1].title}
                  </span>
                )}
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
