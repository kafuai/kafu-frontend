"use client";

import { useLocalization } from "@/components/localization/LocalizationContext";

const ARABIC_CONTENT = {
  badge: "مصمم لكل أطراف العمل اليومي",
  title: "كل مستخدم يعرف ما عليه وما يحتاج إلى متابعته",
  description:
    "يوفر KAFU AI تجربة واضحة بحسب دور المستخدم، من الموظف الذي يقدّم الطلب إلى المدير الذي يراجعه وفريق الموارد البشرية الذي يدير العملية.",
  audiences: [
    {
      title: "فريق الموارد البشرية",
      description: "إدارة ملفات الموظفين والحضور والإجازات والطلبات والرواتب من مكان واحد.",
    },
    {
      title: "المديرون ورؤساء الأقسام",
      description: "مراجعة طلبات الفريق ومتابعة الحضور والغياب واتخاذ قرارات الموافقة ضمن الصلاحيات المحددة.",
    },
    {
      title: "الموظفون",
      description: "الوصول إلى الخدمات، وتقديم طلبات الإجازة والخدمات الوظيفية، ومتابعة حالتها.",
    },
    {
      title: "إدارة المنشأة",
      description: "متابعة عمليات الموارد البشرية والاطلاع على المعلومات اللازمة للإشراف واتخاذ القرار.",
    },
  ],
} as const;

const ENGLISH_CONTENT = {
  badge: "Built Around Everyday HR Work",
  title: "A clear experience for everyone involved",
  description:
    "KAFU AI gives each user a role-based experience, from the employee submitting a request to the manager reviewing it and HR managing the process.",
  audiences: [
    {
      title: "HR Teams",
      description: "Manage employee records, attendance, leave, requests, and payroll in one place.",
    },
    {
      title: "Managers & Department Heads",
      description: "Review team requests, follow attendance and absence, and make approval decisions within their assigned permissions.",
    },
    {
      title: "Employees",
      description: "Access services, submit leave and employee-service requests, and track their status.",
    },
    {
      title: "Business Administrators",
      description: "Oversee HR operations and access the information needed to supervise day-to-day work.",
    },
  ],
} as const;


export function LandingAudience() {
  const { locale } = useLocalization();
  const isArabic = locale === "ar";

  const content = isArabic ? ARABIC_CONTENT : ENGLISH_CONTENT;

  return (
    // قمنا بإضافة خاصية dir هنا للتحكم باتجاه المكون كاملاً
    <section 
      dir={isArabic ? "rtl" : "ltr"} 
      className="border-b border-[var(--landing-border)] bg-[var(--landing-bg-primary)] px-6 py-20 lg:px-10"
    >
      <div className="mx-auto max-w-7xl">
        {/* لتجنب أي مشاكل في المحاذاة، يمكنك التأكد من أن النص يبدأ من بداية الاتجاه الصحيح باستخدام text-start */}
        <div className="max-w-3xl text-start">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--landing-accent)] sm:text-sm">
            {content.badge}
          </p>

          <h2 className="mt-4 text-3xl font-semibold leading-tight tracking-tight text-[var(--landing-text-primary)] sm:text-4xl lg:text-[2.75rem]">
            {content.title}
          </h2>

          <p className="mt-5 max-w-2xl text-base leading-8 text-[var(--landing-text-secondary)] sm:text-lg">
            {content.description}
          </p>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {content.audiences.map((audience, index) => (
            <article
              key={audience.title}
              className="group flex min-h-60 flex-col text-start rounded-2xl border border-[var(--landing-border)] bg-[var(--landing-surface)] p-6 transition duration-200 hover:-translate-y-0.5 hover:border-[var(--landing-accent-border)] hover:bg-[var(--landing-surface-hover)]"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--landing-accent-border)] bg-[var(--landing-accent-soft)] text-xs font-semibold text-[var(--landing-accent-strong)]">
                {String(index + 1).padStart(2, "0")}
              </div>

              <h3 className="mt-5 text-lg font-semibold leading-7 text-[var(--landing-text-primary)]">
                {audience.title}
              </h3>

              <p className="mt-3 text-sm leading-7 text-[var(--landing-text-secondary)] sm:text-base">
                {audience.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
