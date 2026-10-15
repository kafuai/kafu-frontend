export default function OperatingModelSection({ isArabic }: { isArabic: boolean }) {
  const points = isArabic
    ? [
        "معرفة مؤسسية موحدة",
        "سياق تشغيلي مخصص",
        "تنفيذ مرحلي قابل للقياس",
        "حوكمة ومراجعة تنفيذية",
      ]
    : [
        "Unified enterprise knowledge",
        "Customized operational context",
        "Measurable phased execution",
        "Executive governance and review",
      ];

  return (
    <section className="mt-8 grid gap-4">
      <article className="rounded-[24px] border border-[var(--border-default)] bg-[var(--surface)] p-6 shadow-[var(--shadow-small)]">
        <p className="text-xs font-black text-[var(--brand-primary)]">
          OPERATING MODEL
        </p>
        <h2 className="mt-2 text-2xl font-black tracking-tight">
          {isArabic ? "كيف سيعمل هذا الفريق؟" : "How Will This Team Operate?"}
        </h2>
        <p className="mt-4 text-sm leading-8 text-[var(--text-secondary)] md:text-base">
          {isArabic
            ? "يستند كل وكيل رقمي إلى فهم شامل لسياق المؤسسة، مما يمكّنه من تنفيذ المهام واتخاذ إجراءات مرتبطة بواقع المؤسسة وسياساتها وأولوياتها، بدلًا من تقديم إجابات عامة وغير مخصصة."
            : "Each digital agent operates on top of Corporate Brain and uses Corporate DNA to understand the organization's context. This enables the team to execute tasks and take actions tied to the company's actual policies, priorities, and operating environment instead of generic responses."}
        </p>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {points.map((item) => (
            <div
              key={item}
              className="flex items-center gap-3 rounded-2xl border border-[var(--border-default)] bg-[var(--surface-muted)] px-4 py-3.5"
            >
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-[var(--brand-subtle)]">
                <span className="h-2 w-2 rounded-full bg-[var(--brand-primary)]" />
              </span>
              <p className="text-sm font-bold text-[var(--text-secondary)]">{item}</p>
            </div>
          ))}
        </div>
      </article>
    </section>
  );
}