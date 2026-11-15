export default function HeroSection({ isArabic }: { isArabic: boolean }) {
  return (
    <section className="relative overflow-hidden rounded-[28px] border border-[var(--border-default)] bg-[var(--surface)] shadow-[var(--shadow-small)]">
      <div className="absolute inset-y-0 start-0 w-1 bg-[var(--brand-primary)]" />
      <div className="grid gap-6 px-6 py-7 md:px-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:py-8">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-2 rounded-full border border-[var(--border-default)] bg-[var(--brand-subtle)] px-3 py-1.5 text-[11px] font-black text-[var(--brand-primary)]">
              <span className="h-2 w-2 rounded-full bg-[var(--brand-primary)]" />
              DIGITAL WORKFORCE
            </span>
            <span className="rounded-full border border-[var(--border-default)] bg-[var(--surface-muted)] px-3 py-1.5 text-[11px] font-bold text-[var(--text-secondary)]">
              {isArabic ? "فريقك الرقمي المخصص" : "Your Custom Digital Workforce"}
            </span>
          </div>

          <h1 className="mt-4 text-3xl font-black tracking-tight md:text-4xl">
            {isArabic ? "فريقك الرقمي" : "Your Digital Workforce"}
          </h1>

          <p className="mt-3 max-w-4xl text-sm leading-7 text-[var(--text-secondary)] md:text-base md:leading-8">
            {isArabic
              ? "تم تهيئة فريقك الرقمي المرحلي ليتوافق مع الأوليات التشغيلة للمؤسسة "
              : "Your phased digital workforce is configured to align with with your organization's operational priorities."}
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            <span className="rounded-lg bg-[var(--surface-muted)] px-3 py-2 text-xs font-bold text-[var(--text-secondary)]">
              {isArabic ? "تشغيل مرحلي" : "Phased Operation"}
            </span>
            <span className="rounded-lg bg-[var(--surface-muted)] px-3 py-2 text-xs font-bold text-[var(--text-secondary)]">
              {isArabic ? "حوكمة ومراجعة" : "Governance & Review"}
            </span>
            <span className="rounded-lg bg-[var(--surface-muted)] px-3 py-2 text-xs font-bold text-[var(--text-secondary)]">
              {isArabic ? "قياس الأثر" : "Impact Measurement"}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}