"use client";

import {
  BrainCircuit,
  ChartNoAxesCombined,
  DatabaseZap,
  Network,
  ShieldCheck,
  UsersRound,
} from "lucide-react";

import { useWebsiteLanguage } from "@/components/localization";

const content = {
  en: {
    eyebrow: "Connected Enterprise Capabilities",
    title:
      "One intelligence environment across knowledge, decisions and execution.",
    description:
      "KAFU AI is designed as an integrated enterprise platform, not a collection of disconnected AI tools.",
    items: [
      {
        icon: BrainCircuit,
        title: "Corporate Brain",
        description:
          "Transform institutional knowledge into a governed organizational memory that supports real executive decisions.",
      },
      {
        icon: ChartNoAxesCombined,
        title: "Decision Intelligence",
        description:
          "Convert fragmented business context into priorities, risks, recommendations and decision-ready executive views.",
      },
      {
        icon: Network,
        title: "Command Center",
        description:
          "Connect strategic priorities with actions, ownership, progress and leadership accountability.",
      },
      {
        icon: UsersRound,
        title: "Digital Workforce",
        description:
          "Coordinate AI-assisted work around approved organizational responsibilities and measurable outcomes.",
      },
      {
        icon: DatabaseZap,
        title: "Enterprise Context",
        description:
          "Bring together relevant knowledge, operating signals and organizational priorities across the enterprise.",
      },
      {
        icon: ShieldCheck,
        title: "Governed Adoption",
        description:
          "Introduce AI through controlled use cases, defined authority, access management and auditable execution.",
      },
    ],
  },
  ar: {
    eyebrow: "قدرات مؤسسية مترابطة",
    title: "بيئة ذكاء واحدة للمعرفة والقرارات والتنفيذ.",
    description:
      "صُممت كفو كمنصة مؤسسية متكاملة، وليست مجموعة من أدوات الذكاء الاصطناعي المنفصلة.",
    items: [
      {
        icon: BrainCircuit,
        title: "العقل المؤسسي",
        description:
          "حوّل المعرفة المؤسسية إلى ذاكرة تنظيمية محكومة تدعم القرارات التنفيذية الحقيقية.",
      },
      {
        icon: ChartNoAxesCombined,
        title: "ذكاء القرار",
        description:
          "حوّل السياق المتفرق إلى أولويات ومخاطر وتوصيات ورؤى جاهزة لاتخاذ القرار.",
      },
      {
        icon: Network,
        title: "مركز القيادة",
        description:
          "اربط الأولويات الاستراتيجية بالإجراءات والمسؤوليات والتقدم والمساءلة القيادية.",
      },
      {
        icon: UsersRound,
        title: "القوى العاملة الرقمية",
        description:
          "نسّق العمل المدعوم بالذكاء الاصطناعي حول المسؤوليات المعتمدة والنتائج القابلة للقياس.",
      },
      {
        icon: DatabaseZap,
        title: "السياق المؤسسي",
        description:
          "اجمع المعرفة وإشارات التشغيل والأولويات التنظيمية ذات الصلة عبر المؤسسة.",
      },
      {
        icon: ShieldCheck,
        title: "تبنٍ محكوم",
        description:
          "أدخل الذكاء الاصطناعي عبر حالات استخدام مضبوطة وصلاحيات محددة وتنفيذ قابل للتدقيق.",
      },
    ],
  },
};

export default function CapabilitySection() {
  const { language } = useWebsiteLanguage();
  const copy = content[language];

  return (
    <section id="capabilities" className="section-spacing bg-white">
      <div className="website-shell">
        <div className="max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--brand-primary)]">
            {copy.eyebrow}
          </p>

          <h2 className="text-balance mt-5 text-3xl font-semibold tracking-[-0.035em] text-[var(--text-primary)] sm:text-4xl lg:text-5xl">
            {copy.title}
          </h2>

          <p className="mt-6 max-w-2xl text-base leading-8 text-[var(--text-secondary)]">
            {copy.description}
          </p>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {copy.items.map((capability) => {
            const Icon = capability.icon;

            return (
              <article
                key={capability.title}
                className="group rounded-[24px] border border-[var(--border-default)] bg-white p-7 shadow-[var(--shadow-sm)] transition duration-300 hover:-translate-y-1 hover:border-[var(--border-strong)] hover:shadow-[var(--shadow-md)]"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--brand-subtle)] text-[var(--brand-primary)]">
                  <Icon size={22} />
                </div>

                <h3 className="mt-6 text-lg font-semibold text-[var(--text-primary)]">
                  {capability.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">
                  {capability.description}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
