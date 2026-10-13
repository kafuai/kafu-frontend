// StrategySection.tsx
export default function StrategySection({
  isArabic,
  companyName,
  roadmap,
}: {
  isArabic: boolean;
  companyName: string;
  roadmap: any[];
}) {
  return (
    <section className="mt-5 overflow-hidden rounded-[28px] border border-[var(--border-default)] bg-[var(--surface)] shadow-[var(--shadow-small)]">
      <div className="grid lg:grid-cols-[340px_minmax(0,1fr)]">
        <div className="border-b border-[var(--border-default)] bg-[var(--brand-subtle)] p-6 lg:border-b-0 lg:border-e lg:p-7">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--brand-primary)] text-sm font-black text-white shadow-sm">
            AI
          </div>
          <p className="mt-5 text-xs font-black text-[var(--brand-primary)]">
            EXECUTIVE STRATEGY
          </p>
          <h2 className="mt-3 text-2xl font-black tracking-tight">
            {isArabic ? "استراتيجية كفو للتشغيل" : "KAFU AI Operating Strategy"}
          </h2>
          <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">
            {isArabic
              ? "تفعيل مرحلي يبدأ بالأعمال الأكثر تكرارًا وتأثيرًا، ثم التوسع بناءً على النتائج الفعلية."
              : "Start with the highest-frequency and highest-impact work, then expand based on actual results."}
          </p>
        </div>

        <div className="p-6 lg:p-7">
          <p className="max-w-5xl text-sm leading-8 text-[var(--text-secondary)] md:text-base">
            {isArabic ? (
              <>
                لضمان أعلى كفاءة تشغيلية ل{" "}
                <span className="font-black text-[var(--text-primary)]">
                  {companyName}
                </span>
                ، يبدأ فريقك بمعالجة الأعمال الأعلى تكرارًا وتأثيرًا، ثم توسيع الفريق بعد بناء المعرفة وقياس النتائج.
              </>
            ) : (
              <>
                We do not recommend activating all agents at once. For{" "}
                <span className="font-black text-[var(--text-primary)]">
                  {companyName}
                </span>
                , the optimal starting point is to activate agents that handle the most frequent and impactful work, then expand the team after building knowledge and measuring results.
              </>
            )}
          </p>

          <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {roadmap.map((item, index) => (
              <article
                key={item.title}
                className="rounded-2xl border border-[var(--border-default)] bg-[var(--surface-muted)] p-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--surface)] text-xs font-black text-[var(--brand-primary)] shadow-sm">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="text-[10px] font-black text-[var(--text-muted)]">
                    {isArabic ? `المرحلة ${index + 1}` : `Phase ${index + 1}`}
                  </span>
                </div>
                <h3 className="mt-4 text-sm font-black">{item.title}</h3>
                <p className="mt-2 text-xs font-medium leading-6 text-[var(--text-secondary)]">
                  {item.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}