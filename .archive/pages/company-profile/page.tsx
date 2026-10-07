import Link from "next/link";
import {
  ArrowUpLeft,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  Cpu,
  Landmark,
  Settings2,
  ShieldCheck,
  Sparkles,
  Target,
  UsersRound,
  WalletCards,
  type LucideIcon,
} from "lucide-react";

type ExecutiveRole = {
  title: string;
  subtitle: string;
  focus: string;
  icon: LucideIcon;
  tone: string;
};

const executiveRoles: ExecutiveRole[] = [
  {
    title: "مالك الشركة أو المؤسس",
    subtitle: "Owner / Founder",
    focus:
      "التركيز على بناء قيمة المؤسسة، التوسع، الاستثمار، استدامة الأعمال، والاستعداد للنمو.",
    icon: Building2,
    tone:
      "bg-[var(--warning-background)] text-[var(--warning)] border-[color-mix(in_srgb,var(--warning)_14%,var(--border-default))]",
  },
  {
    title: "الرئيس التنفيذي",
    subtitle: "Chief Executive Officer · CEO",
    focus:
      "التركيز على القرارات الاستراتيجية، النمو، المخاطر، الأداء المؤسسي، والعائد على الاستثمار.",
    icon: BriefcaseBusiness,
    tone:
      "bg-[var(--success-background)] text-[var(--success)] border-[color-mix(in_srgb,var(--success)_14%,var(--border-default))]",
  },
  {
    title: "مدير الموارد البشرية",
    subtitle: "CHRO / HR Director",
    focus:
      "التركيز على الموظفين، السياسات، التوظيف، تجربة الموظف، الأداء، والامتثال.",
    icon: UsersRound,
    tone:
      "bg-[var(--brand-subtle)] text-[var(--brand-primary)] border-[color-mix(in_srgb,var(--brand-primary)_14%,var(--border-default))]",
  },
  {
    title: "مدير العمليات",
    subtitle: "Chief Operating Officer · COO",
    focus:
      "التركيز على العمليات اليومية، الكفاءة، الاختناقات التشغيلية، وجودة تنفيذ الأعمال.",
    icon: Settings2,
    tone:
      "bg-[var(--brand-subtle)] text-[var(--brand-primary)] border-[color-mix(in_srgb,var(--brand-primary)_14%,var(--border-default))]",
  },
  {
    title: "المدير المالي",
    subtitle: "Chief Financial Officer · CFO",
    focus:
      "التركيز على التكاليف، الربحية، التدفقات النقدية، الميزانيات، ومؤشرات الأداء المالي.",
    icon: WalletCards,
    tone:
      "bg-[var(--success-background)] text-[var(--success)] border-[color-mix(in_srgb,var(--success)_14%,var(--border-default))]",
  },
  {
    title: "مدير التقنية",
    subtitle: "CIO / CTO",
    focus:
      "التركيز على الأنظمة، الأمن السيبراني، التكاملات، البنية التقنية، والجاهزية الرقمية.",
    icon: Cpu,
    tone:
      "bg-[var(--brand-subtle)] text-[var(--brand-primary)] border-[color-mix(in_srgb,var(--brand-primary)_14%,var(--border-default))]",
  },
];

const selectionBenefits = [
  {
    title: "أسئلة أكثر دقة",
    description:
      "تكييف مسار الاستكشاف وفق مسؤولياتك والقرارات التي تتخذها داخل المؤسسة.",
    icon: Target,
  },
  {
    title: "تحليل تنفيذي مخصص",
    description:
      "ترتيب المؤشرات والمخاطر والفرص بحسب الأولويات الفعلية لدورك.",
    icon: Sparkles,
  },
  {
    title: "توصيات قابلة للتنفيذ",
    description:
      "تقديم توصيات عملية مرتبطة بصلاحياتك وأهدافك ومجال مسؤوليتك.",
    icon: ShieldCheck,
  },
];

export default function CompanyProfilePage() {
  return (
    <main
      className="min-h-screen bg-[var(--background)] px-4 py-6 sm:px-6 md:px-8 md:py-7 lg:px-10"
      dir="rtl"
    >
      <div className="mx-auto max-w-[1500px] space-y-6">
        <section className="relative overflow-hidden rounded-[20px] border border-[var(--border-default)] bg-[var(--surface)] px-5 py-6 shadow-[var(--shadow-small)] sm:px-7 sm:py-7 lg:px-8">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 start-0 w-1 bg-[var(--brand-primary)]"
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute -end-24 -top-24 h-64 w-64 rounded-full bg-[color-mix(in_srgb,var(--brand-primary)_6%,transparent)]"
          />

          <div className="relative grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-center">
            <div className="flex min-w-0 items-start gap-4">
              <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-[13px] border border-[color-mix(in_srgb,var(--brand-primary)_14%,var(--border-default))] bg-[var(--brand-subtle)] text-[var(--brand-primary)] shadow-[var(--shadow-small)]">
                <Landmark size={22} />
              </span>

              <div className="min-w-0">
                <p className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-[var(--brand-primary)]">
                  KAFU Executive AI
                </p>

                <h1 className="mt-2 text-2xl font-extrabold leading-tight tracking-[-0.035em] text-[var(--text-primary)] sm:text-3xl lg:text-[34px]">
                  اختر دورك التنفيذي داخل المؤسسة
                </h1>

                <p className="mt-3 max-w-3xl text-sm font-medium leading-7 text-[var(--text-secondary)] sm:text-base">
                  سيستخدم KAFU AI هذا الاختيار لتخصيص الأسئلة والتحليلات
                  والمؤشرات والتوصيات وفق مسؤولياتك وأولوياتك التنفيذية.
                </p>
              </div>
            </div>

            <div className="rounded-[16px] border border-[var(--border-default)] bg-[var(--surface-muted)] p-4">
              <div className="flex items-start gap-3">
                <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-[11px] bg-[var(--success-background)] text-[var(--success)]">
                  <CheckCircle2 size={18} />
                </span>

                <div>
                  <p className="text-sm font-extrabold text-[var(--text-primary)]">
                    جلسة مخصصة بالكامل
                  </p>

                  <p className="mt-1 text-xs leading-6 text-[var(--text-secondary)]">
                    يمكنك المتابعة مباشرة بعد اختيار الدور، وسيبقى مسار
                    التقييم مرتبطًا بأهدافك التنفيذية.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          className="grid gap-5 md:grid-cols-2 xl:grid-cols-3"
          aria-label="اختيار الدور التنفيذي"
        >
          {executiveRoles.map((role) => {
            const Icon = role.icon;

            return (
              <Link
                key={role.title}
                href="/assessment"
                className="group flex min-h-[280px] flex-col rounded-[20px] border border-[var(--border-default)] bg-[var(--surface)] p-5 shadow-[var(--shadow-small)] transition duration-200 hover:-translate-y-0.5 hover:border-[color-mix(in_srgb,var(--brand-primary)_24%,var(--border-default))] hover:shadow-[var(--shadow-medium)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)] focus-visible:ring-offset-2 sm:p-6"
              >
                <div className="flex items-start justify-between gap-4">
                  <span
                    className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-[13px] border ${role.tone}`}
                  >
                    <Icon size={20} />
                  </span>

                  <ArrowUpLeft
                    size={17}
                    className="mt-1 text-[var(--text-muted)] transition duration-200 group-hover:-translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[var(--brand-primary)]"
                  />
                </div>

                <div className="mt-5">
                  <h2 className="text-lg font-extrabold leading-7 text-[var(--text-primary)]">
                    {role.title}
                  </h2>

                  <p
                    className="mt-1 text-xs font-extrabold text-[var(--brand-primary)]"
                    dir="ltr"
                  >
                    {role.subtitle}
                  </p>

                  <p className="mt-4 text-sm leading-7 text-[var(--text-secondary)]">
                    {role.focus}
                  </p>
                </div>

                <div className="mt-auto border-t border-[var(--border-default)] pt-4">
                  <span className="inline-flex items-center gap-2 text-xs font-extrabold text-[var(--brand-primary)]">
                    ابدأ الجلسة بهذا الدور
                    <ArrowUpLeft
                      size={14}
                      className="transition duration-200 group-hover:-translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                  </span>
                </div>
              </Link>
            );
          })}
        </section>

        <section className="rounded-[20px] border border-[var(--border-default)] bg-[var(--surface)] p-5 shadow-[var(--shadow-small)] sm:p-6 lg:p-7">
          <div className="flex items-start gap-3">
            <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] bg-[var(--brand-subtle)] text-[var(--brand-primary)]">
              <Sparkles size={19} />
            </span>

            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-[var(--brand-primary)]">
                تجربة تنفيذية مخصصة
              </p>

              <h2 className="mt-1.5 text-xl font-extrabold text-[var(--text-primary)] sm:text-2xl">
                لماذا نبدأ بتحديد دورك؟
              </h2>

              <p className="mt-2 max-w-4xl text-sm leading-7 text-[var(--text-secondary)]">
                تختلف زاوية اتخاذ القرار بين المؤسس والرئيس التنفيذي ومديري
                الموارد البشرية والعمليات والمالية والتقنية. لذلك لا يقدم KAFU
                AI تجربة عامة، بل يبني جلسة تتوافق مع مسؤوليات كل قائد داخل
                المؤسسة.
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {selectionBenefits.map((benefit) => {
              const Icon = benefit.icon;

              return (
                <article
                  key={benefit.title}
                  className="rounded-[16px] border border-[var(--border-default)] bg-[var(--surface-muted)] p-4"
                >
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-[11px] bg-[var(--surface)] text-[var(--brand-primary)] shadow-[var(--shadow-small)]">
                    <Icon size={17} />
                  </span>

                  <h3 className="mt-4 text-sm font-extrabold text-[var(--text-primary)]">
                    {benefit.title}
                  </h3>

                  <p className="mt-1.5 text-xs leading-6 text-[var(--text-secondary)]">
                    {benefit.description}
                  </p>
                </article>
              );
            })}
          </div>
        </section>

        <footer className="flex flex-col gap-2 border-t border-[var(--border-default)] px-1 pt-5 text-xs font-medium text-[var(--text-muted)] sm:flex-row sm:items-center sm:justify-between">
          <span>اختيار الملف التنفيذي للمؤسسة</span>

          <span className="inline-flex items-center gap-2">
            <Building2 size={13} />
            KAFU AI
          </span>
        </footer>
      </div>
    </main>
  );
}
