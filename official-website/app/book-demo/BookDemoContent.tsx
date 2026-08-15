"use client";

import DemoRequestForm from "@/components/forms/DemoRequestForm";
import SectionHero from "@/components/shared/SectionHero";
import { useWebsiteLanguage } from "@/components/localization";

const content = {
  en: {
    hero: {
      eyebrow: "Executive Discovery",
      title:
        "Start with one focused conversation about your organization.",
      description:
        "Book a tailored executive session to explore where KAFU AI can create the greatest value across organizational knowledge, decision-making, governance, and execution.",
    },
    sessionDetails: [
      "Confidential",
      "60–90 minutes",
      "Tailored to your organization",
      "No technical preparation required",
    ],
    briefing: {
      eyebrow: "What to Expect",
      title: "A practical executive discovery session.",
      description:
        "Designed for executives, transformation leaders, and enterprise decision-makers exploring a practical and governed approach to AI adoption.",
      points: [
        {
          title: "Business priorities",
          description:
            "A focused discussion around your organization’s priorities and operating context.",
        },
        {
          title: "Platform perspective",
          description:
            "A guided view of how KAFU AI connects knowledge, decisions, and execution.",
        },
        {
          title: "Readiness and value",
          description:
            "An initial review of readiness, governance, and high-value use cases.",
        },
        {
          title: "Recommended next steps",
          description:
            "Clear next steps based on your objectives and organizational maturity.",
        },
      ],
      preferEmail: "Prefer email?",
    },
    form: {
      eyebrow: "Request Your Executive Session",
      title: "Tell us about your organization and priorities.",
      description:
        "We will use this information to prepare a relevant and focused executive conversation.",
    },
  },

  ar: {
    hero: {
      eyebrow: "اكتشاف تنفيذي",
      title: "ابدأ بمحادثة مركزة حول مؤسستك وأولوياتها.",
      description:
        "احجز جلسة تنفيذية مخصصة لاستكشاف المجالات التي يمكن أن تحقق فيها KAFU AI أعلى قيمة عبر المعرفة التنظيمية وصناعة القرار والحوكمة والتنفيذ.",
    },
    sessionDetails: [
      "جلسة سرية",
      "من 60 إلى 90 دقيقة",
      "مصممة وفق احتياجات مؤسستك",
      "لا تتطلب تحضيرًا تقنيًا",
    ],
    briefing: {
      eyebrow: "ما الذي تتوقعه؟",
      title: "جلسة اكتشاف تنفيذية عملية.",
      description:
        "مصممة للقيادات التنفيذية وقادة التحول وصنّاع القرار المؤسسي الباحثين عن نهج عملي ومحكوم لتبنّي الذكاء الاصطناعي.",
      points: [
        {
          title: "الأولويات المؤسسية",
          description:
            "مناقشة مركزة حول أولويات مؤسستك وسياقها التشغيلي.",
        },
        {
          title: "منظور المنصة",
          description:
            "استعراض موجّه لكيفية ربط KAFU AI بين المعرفة والقرارات والتنفيذ.",
        },
        {
          title: "الجاهزية والقيمة",
          description:
            "مراجعة أولية للجاهزية والحوكمة وحالات الاستخدام ذات القيمة العالية.",
        },
        {
          title: "الخطوات التالية",
          description:
            "توصيات واضحة تستند إلى أهدافك ومستوى النضج المؤسسي.",
        },
      ],
      preferEmail: "تفضّل التواصل عبر البريد؟",
    },
    form: {
      eyebrow: "اطلب جلستك التنفيذية",
      title: "حدثنا عن مؤسستك وأولوياتها.",
      description:
        "سنستخدم هذه المعلومات لإعداد محادثة تنفيذية أكثر صلة وتركيزًا.",
    },
  },
} as const;

export default function BookDemoContent() {
  const { language, direction } = useWebsiteLanguage();
  const pageContent = content[language];

  return (
    <main
      className="book-demo-page"
      dir={direction}
      lang={language}
    >
      <SectionHero
        eyebrow={pageContent.hero.eyebrow}
        title={pageContent.hero.title}
        description={pageContent.hero.description}
      />

      <section
        className="book-demo-trust"
        aria-label={
          language === "ar" ? "تفاصيل الجلسة" : "Session details"
        }
      >
        <div className="site-container book-demo-trust__inner">
          {pageContent.sessionDetails.map((detail, index) => (
            <div className="book-demo-trust__item" key={detail}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{detail}</strong>
            </div>
          ))}
        </div>
      </section>

      <section className="demo-request-section">
        <div className="site-container demo-request-layout">
          <aside className="demo-briefing">
            <span className="section-eyebrow">
              {pageContent.briefing.eyebrow}
            </span>

            <h2>{pageContent.briefing.title}</h2>

            <p className="demo-briefing__intro">
              {pageContent.briefing.description}
            </p>

            <div className="demo-briefing__list">
              {pageContent.briefing.points.map((point, index) => (
                <article
                  className="demo-briefing__item"
                  key={point.title}
                >
                  <span>
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <div>
                    <h3>{point.title}</h3>
                    <p>{point.description}</p>
                  </div>
                </article>
              ))}
            </div>

            <div className="demo-briefing__contact">
              <span>{pageContent.briefing.preferEmail}</span>
              <a href="mailto:hello@kafu.ai" dir="ltr">
                hello@kafu.ai
              </a>
            </div>
          </aside>

          <div className="demo-form-panel">
            <div className="demo-form-panel__heading">
              <span className="section-eyebrow">
                {pageContent.form.eyebrow}
              </span>

              <h2>{pageContent.form.title}</h2>

              <p>{pageContent.form.description}</p>
            </div>

            <DemoRequestForm />
          </div>
        </div>
      </section>
    </main>
  );
}
