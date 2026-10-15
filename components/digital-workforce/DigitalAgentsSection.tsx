import Link from "next/link";
import { WorkforceMember } from "./types";

export default function DigitalAgentsSection({ isArabic, team }: { isArabic: boolean; team: WorkforceMember[] }) {
  return (
    <section className="mt-8">
      <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-black text-[var(--brand-primary)]">
            Automate Your Workflow
          </p>
          <h2 className="mt-2 text-2xl font-black tracking-tight md:text-3xl">
            {isArabic ? "وكلاؤك الرقميون" : "Your Digital Agents"}
          </h2>
        </div>
        <p className="max-w-2xl text-sm leading-7 text-[var(--text-secondary)]">
          {isArabic
            ? "فريق مرحلي مصمم لدعم العمليات اليومية والمعرفة المؤسسية والقرارات التنفيذية والامتثال."
            : "A phased team designed to support daily operations, enterprise knowledge, executive decisions, and compliance."}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {team.map((member) => (
          <Link
            key={member.code}
            href={member.href}
            className="group flex min-h-full flex-col overflow-hidden rounded-[24px] border border-[var(--border-default)] bg-[var(--surface)] shadow-[var(--shadow-small)] transition duration-200 hover:-translate-y-0.5 hover:border-[var(--brand-primary)] hover:shadow-[var(--shadow-medium)] cursor-pointer"
          >
            <div className="flex items-start justify-between gap-4 border-b border-[var(--border-default)] bg-[var(--surface-muted)] px-5 py-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--brand-primary)] text-sm font-black text-white shadow-sm">
                {member.code}
              </div>
            </div>

            <div className="flex flex-1 flex-col p-5">
              <h3 className="text-lg font-black tracking-tight">{member.title}</h3>
              <p className="mt-1.5 text-[11px] font-black text-[var(--brand-primary)]">{member.subtitle}</p>
              <p className="mt-4 text-sm leading-7 text-[var(--text-secondary)]">{member.description}</p>

              <div className="mt-5 rounded-2xl border border-[var(--border-default)] bg-[var(--surface-muted)] p-4">
                <div className="mb-2.5 flex items-center justify-between text-xs font-black">
                  <span className="text-[var(--text-secondary)]">
                    {isArabic ? "جاهزية التفعيل" : "Activation Readiness"}
                  </span>
                  <span className="text-[var(--brand-primary)]">{member.readiness}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-[var(--surface)]">
                  <div
                    className="h-full rounded-full bg-[var(--brand-primary)]"
                    style={{ width: member.readiness }}
                  />
                </div>
              </div>

              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                {member.tasks.map((task) => (
                  <div
                    key={task}
                    className="flex min-h-10 items-center rounded-xl border border-[var(--border-default)] bg-[var(--surface-muted)] px-3 py-2 text-xs font-bold text-[var(--text-secondary)]"
                  >
                    <span className="me-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--brand-primary)]" />
                    {task}
                  </div>
                ))}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}