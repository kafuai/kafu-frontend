
import Link from "next/link";

export function LoadingView({ isArabic }: { isArabic: boolean }) {
  return (
    <section className="mt-5 rounded-[28px] border border-[var(--border-default)] bg-[var(--surface)] p-10 text-center shadow-[var(--shadow-small)]">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--brand-subtle)]">
        <span className="h-5 w-5 animate-pulse rounded-full bg-[var(--brand-primary)]" />
      </div>
      <p className="mt-4 text-base font-black">
        {isArabic ? "جارٍ تهيئة فريقك الرقمي" : "Initializing your digital workforce"}
      </p>
      <p className="mt-2 text-sm text-[var(--text-secondary)]">
        {isArabic ? "يتم تحليل بيانات المؤسسة ونتائج الاستكشاف." : "Analyzing company data and Discovery results."}
      </p>
    </section>
  );
}

export function ErrorView({ isArabic, message }: { isArabic: boolean; message: string }) {
  return (
    <section className="mt-5 rounded-[28px] border border-amber-300 bg-amber-50 p-8 text-center text-amber-950 shadow-[var(--shadow-small)] dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-100">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-lg font-black text-amber-800 dark:bg-amber-900/40 dark:text-amber-200">
        !
      </div>
      <h2 className="mt-4 text-xl font-black">
        {isArabic ? "تعذر تحميل مساحة عمل الفريق" : "Unable to load workforce workspace"}
      </h2>
      <p className="mx-auto mt-3 max-w-2xl text-sm leading-7">{message}</p>
      <Link
        href="/assessment"
        className="mt-6 inline-flex min-h-11 items-center justify-center rounded-xl bg-[var(--text-primary)] px-6 text-sm font-black text-[var(--surface)] transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--text-primary)] focus-visible:ring-offset-2"
      >
        {isArabic ? "العودة إلى التقييم" : "Back to Assessment"}
      </Link>
    </section>
  );
}