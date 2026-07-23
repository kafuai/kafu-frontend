"use client";

import Link from "next/link";
import {
  ArrowRight,
  BrainCircuit,
  Building2,
  CheckCircle2,
  Network,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { useWebsiteLanguage } from "@/components/localization";

const content = {
  en: {
    eyebrow: "Executive Intelligence for the Enterprise",
    title: "Your organization has the information.",
    accent: "KAFU AI turns it into clarity.",
    description:
      "Bring organizational knowledge, executive priorities and coordinated execution into one governed environment—so leadership can see what matters, understand the context and act with confidence.",
    primaryAction: "Book an Executive Demo",
    secondaryAction: "Explore the Platform",
    outcomes: [
      "See what needs leadership attention",
      "Reach trusted knowledge faster",
      "Connect decisions with execution",
    ],
    panelEyebrow: "A Unified Executive View",
    panelTitle: "From scattered information to one clear picture",
    panelDescription:
      "Instead of searching across teams, files and systems, leadership gains a connected view of organizational knowledge, priorities, risks and execution.",
    cards: [
      {
        icon: BrainCircuit,
        title: "Corporate Brain",
        text: "Reach institutional knowledge with its relevant business context.",
      },
      {
        icon: Building2,
        title: "Executive Context",
        text: "Understand priorities, risks and the issues requiring attention.",
      },
      {
        icon: Network,
        title: "Coordinated Execution",
        text: "Translate decisions into actions, ownership and visible progress.",
      },
      {
        icon: ShieldCheck,
        title: "Enterprise Governance",
        text: "Adopt AI through controlled and accountable enterprise practices.",
      },
    ],
    priorityLabel: "The Executive Outcome",
    priorityText:
      "Spend less time assembling the picture—and more time deciding what the organization should do next.",
  },
  ar: {
    eyebrow: "ذكاء تنفيذي للمؤسسات",
    title: "المعرفة موجودة.",
    accent: "KAFU AI يحوّلها إلى قرار أوضح.",
    description:
      "اجمع المعرفة التنظيمية والأولويات التنفيذية والتنسيق التشغيلي في بيئة مؤسسية واحدة ومحكومة، لتتمكن القيادة من رؤية ما يهم، وفهم السياق، واتخاذ القرار بثقة.",
    primaryAction: "احجز عرضًا تنفيذيًا",
    secondaryAction: "استكشف المنصة",
    outcomes: [
      "اعرف ما يحتاج إلى انتباه القيادة",
      "صل إلى المعرفة الموثوقة بسرعة",
      "اربط القرارات بالتنفيذ",
    ],
    panelEyebrow: "رؤية تنفيذية موحّدة",
    panelTitle: "من معلومات متفرقة إلى صورة واحدة واضحة",
    panelDescription:
      "بدلًا من البحث بين الإدارات والملفات والأنظمة، تحصل القيادة على رؤية مترابطة للمعرفة والأولويات والمخاطر والتنفيذ.",
    cards: [
      {
        icon: BrainCircuit,
        title: "العقل المؤسسي",
        text: "الوصول إلى المعرفة المؤسسية ضمن سياقها العملي المرتبط بالقرار.",
      },
      {
        icon: Building2,
        title: "السياق التنفيذي",
        text: "فهم الأولويات والمخاطر والموضوعات التي تحتاج إلى تدخل القيادة.",
      },
      {
        icon: Network,
        title: "التنفيذ المنسق",
        text: "تحويل القرارات إلى إجراءات ومسؤوليات وتقدم واضح يمكن متابعته.",
      },
      {
        icon: ShieldCheck,
        title: "الحوكمة المؤسسية",
        text: "تبنّي الذكاء الاصطناعي ضمن ممارسات مؤسسية محكومة ومسؤولة.",
      },
    ],
    priorityLabel: "النتيجة التنفيذية",
    priorityText:
      "وقت أقل في جمع الصورة، ووقت أكبر في تحديد الخطوة التالية التي تحتاجها المؤسسة.",
  },
};

export default function HomeHero() {
  const { language, isArabic } = useWebsiteLanguage();
  const copy = content[language];

  return (
    <section className="enterprise-grid hero-glow relative overflow-hidden bg-[#071321] pb-20 pt-[72px] text-white sm:pt-[82px] lg:min-h-[670px] lg:pb-24 lg:pt-[92px]">
      <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#071321] to-transparent" />

      <div className="website-shell relative z-10 grid items-center gap-16 lg:grid-cols-[1.08fr_0.92fr]">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.07] px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-200">
            <Sparkles size={14} />
            {copy.eyebrow}
          </div>

          <h1 className="text-balance mt-6 max-w-[760px] text-[2.25rem] font-semibold leading-[1.12] tracking-[-0.034em] sm:text-[2.8rem] lg:text-[55px]">
            {copy.title}
            <span className="block text-[#69d1d5]">{copy.accent}</span>
          </h1>

          <p className="mt-8 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
            {copy.description}
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/book-demo"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-[#071321] shadow-xl transition hover:-translate-y-0.5 hover:bg-slate-100"
            >
              {copy.primaryAction}
              <ArrowRight
                size={17}
                className={isArabic ? "rotate-180" : undefined}
              />
            </Link>

            <Link
              href="/platform"
              className="inline-flex min-h-12 items-center justify-center rounded-xl border border-white/15 bg-white/[0.06] px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-white/[0.1]"
            >
              {copy.secondaryAction}
            </Link>
          </div>

          <div className="mt-10 grid gap-3 sm:grid-cols-3">
            {copy.outcomes.map((outcome) => (
              <div
                className="flex items-start gap-2 text-sm leading-6 text-slate-300"
                key={outcome}
              >
                <CheckCircle2
                  size={17}
                  className="mt-1 shrink-0 text-[#69d1d5]"
                />
                <span>{outcome}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="absolute -inset-6 rounded-[36px] bg-[#69d1d5]/10 blur-3xl" />

          <div className="relative rounded-[28px] border border-white/10 bg-[#0b1d30]/90 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#8ee1e4]">
              {copy.panelEyebrow}
            </p>

            <h2 className="mt-4 text-2xl font-semibold">
              {copy.panelTitle}
            </h2>

            <p className="mt-3 text-sm leading-7 text-slate-400">
              {copy.panelDescription}
            </p>

            <div className="mt-7 grid gap-4 sm:grid-cols-2">
              {copy.cards.map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.title}
                    className="rounded-2xl border border-white/10 bg-white/[0.055] p-4"
                  >
                    <Icon size={20} className="text-[#69d1d5]" />
                    <p className="mt-4 text-sm font-semibold">{item.title}</p>
                    <p className="mt-2 text-xs leading-5 text-slate-400">
                      {item.text}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 rounded-2xl border border-[#69d1d5]/20 bg-[#69d1d5]/[0.08] p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#8ee1e4]">
                {copy.priorityLabel}
              </p>

              <p className="mt-3 text-sm leading-6 text-slate-200">
                {copy.priorityText}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}