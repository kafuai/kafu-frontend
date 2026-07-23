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
      "One intelligence environment for clearer decisions and coordinated execution.",
    description:
      "KAFU AI connects organizational knowledge, executive priorities and operational progress in one governed enterprise platform.",
    items: [
      {
        icon: BrainCircuit,
        title: "Corporate Brain",
        description:
          "Preserve institutional knowledge and make it available in the context leaders need to understand the organization and make informed decisions.",
      },
      {
        icon: ChartNoAxesCombined,
        title: "Decision Intelligence",
        description:
          "Turn fragmented business information into clear priorities, risks, implications and recommendations ready for executive review.",
      },
      {
        icon: Network,
        title: "Command Center",
        description:
          "Give leadership one view of strategic priorities, responsible owners, required actions and measurable progress.",
      },
      {
        icon: UsersRound,
        title: "Digital Workforce",
        description:
          "Coordinate AI-assisted work around approved responsibilities, defined workflows and outcomes that can be monitored.",
      },
      {
        icon: DatabaseZap,
        title: "Enterprise Context",
        description:
          "Connect relevant knowledge, operational signals and organizational priorities so every insight reflects the wider business context.",
      },
      {
        icon: ShieldCheck,
        title: "Governed Adoption",
        description:
          "Introduce AI through controlled use cases, clear authority, managed access and execution that remains visible and auditable.",
      },
    ],
  },
  ar: {
    eyebrow: "قدرات مؤسسية مترابطة",
    title: "بيئة ذكاء واحدة لقرارات أوضح وتنفيذ أكثر تنسيقًا.",
    description:
      "تربط KAFU AI المعرفة التنظيمية والأولويات التنفيذية والتقدم التشغيلي ضمن منصة مؤسسية واحدة ومحكومة.",
    items: [
      {
        icon: BrainCircuit,
        title: "العقل المؤسسي",
        description:
          "احفظ المعرفة المؤسسية واجعلها متاحة ضمن السياق الذي تحتاجه القيادة لفهم المؤسسة واتخاذ قرارات مدروسة.",
      },
      {
        icon: ChartNoAxesCombined,
        title: "ذكاء القرار",
        description:
          "حوّل المعلومات المتفرقة إلى أولويات ومخاطر وآثار وتوصيات واضحة وجاهزة للمراجعة التنفيذية.",
      },
      {
        icon: Network,
        title: "مركز القيادة",
        description:
          "امنح القيادة رؤية واحدة للأولويات الاستراتيجية والمسؤولين والإجراءات المطلوبة والتقدم القابل للقياس.",
      },
      {
        icon: UsersRound,
        title: "القوى العاملة الرقمية",
        description:
          "نسّق العمل المدعوم بالذكاء الاصطناعي حول مسؤوليات معتمدة ومسارات واضحة ونتائج يمكن متابعتها.",
      },
      {
        icon: DatabaseZap,
        title: "السياق المؤسسي",
        description:
          "اربط المعرفة وإشارات التشغيل والأولويات التنظيمية حتى تعكس كل رؤية السياق الأشمل للمؤسسة.",
      },
      {
        icon: ShieldCheck,
        title: "تبنٍ محكوم",
        description:
          "أدخل الذكاء الاصطناعي عبر حالات استخدام مضبوطة وصلاحيات واضحة ووصول مُدار وتنفيذ ظاهر وقابل للتدقيق.",
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