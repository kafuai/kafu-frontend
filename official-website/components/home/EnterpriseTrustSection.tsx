"use client";

import {
  BadgeCheck,
  KeyRound,
  Scale,
  ShieldCheck,
} from "lucide-react";

import { useWebsiteLanguage } from "@/components/localization";

const content = {
  en: {
    eyebrow: "Enterprise Trust",
    title: "Enterprise AI must be trusted before it can scale.",
    description:
      "KAFU AI is designed around governance, accountability and controlled adoption so organizations can introduce AI with confidence.",
    items: [
      {
        icon: ShieldCheck,
        title: "Governed by Design",
        description:
          "AI operates within approved policies, organizational authority and defined business responsibilities.",
      },
      {
        icon: KeyRound,
        title: "Controlled Access",
        description:
          "Knowledge, capabilities and data remain available only to the right people through managed access controls.",
      },
      {
        icon: Scale,
        title: "Executive Accountability",
        description:
          "AI supports decision-making, while executive authority and accountability always remain with the organization.",
      },
      {
        icon: BadgeCheck,
        title: "Measured Adoption",
        description:
          "Every deployment begins with clear business objectives and expands only after measurable value has been demonstrated.",
      },
    ],
  },
  ar: {
    eyebrow: "الثقة المؤسسية",
    title: "يجب أن يكون الذكاء الاصطناعي محل ثقة قبل أن يتوسع داخل المؤسسة.",
    description:
      "صُممت KAFU AI حول الحوكمة والمساءلة والتبني المنضبط، لتتمكن المؤسسات من اعتماد الذكاء الاصطناعي بثقة.",
    items: [
      {
        icon: ShieldCheck,
        title: "حوكمة منذ التصميم",
        description:
          "يعمل الذكاء الاصطناعي ضمن السياسات المعتمدة والصلاحيات التنظيمية والمسؤوليات المحددة.",
      },
      {
        icon: KeyRound,
        title: "وصول محكوم",
        description:
          "تبقى المعرفة والقدرات والبيانات متاحة فقط للأشخاص المخولين عبر ضوابط وصول مُدارة.",
      },
      {
        icon: Scale,
        title: "المساءلة التنفيذية",
        description:
          "يدعم الذكاء الاصطناعي عملية اتخاذ القرار، بينما تبقى السلطة التنفيذية والمسؤولية الكاملة بيد المؤسسة.",
      },
      {
        icon: BadgeCheck,
        title: "تبنٍ قابل للقياس",
        description:
          "يبدأ كل تطبيق بأهداف أعمال واضحة، ولا يتوسع إلا بعد إثبات قيمة قابلة للقياس.",
      },
    ],
  },
};

export default function EnterpriseTrustSection() {
  const { language } = useWebsiteLanguage();
  const copy = content[language];

  return (
    <section
      id="enterprise"
      className="section-spacing overflow-hidden bg-[#071321] text-white"
    >
      <div className="website-shell">
        <div className="grid gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#69d1d5]">
              {copy.eyebrow}
            </p>

            <h2 className="text-balance mt-5 text-3xl font-semibold tracking-[-0.035em] sm:text-4xl lg:text-5xl">
              {copy.title}
            </h2>

            <p className="mt-6 max-w-xl text-base leading-8 text-slate-300">
              {copy.description}
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {copy.items.map((item) => {
              const Icon = item.icon;

              return (
                <article
                  key={item.title}
                  className="rounded-[22px] border border-white/10 bg-white/[0.055] p-6"
                >
                  <Icon size={21} className="text-[#69d1d5]" />

                  <h3 className="mt-5 font-semibold">{item.title}</h3>

                  <p className="mt-3 text-sm leading-7 text-slate-400">
                    {item.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}