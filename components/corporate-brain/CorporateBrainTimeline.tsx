"use client";

import {
  BrainCircuit,
  CheckCircle2,
  Clock3,
  FileSearch,
  Lightbulb,
  MessageSquareText,
} from "lucide-react";

import { useLocalization } from "@/components/localization/LocalizationContext";

export default function CorporateBrainTimeline() {
  const { locale } = useLocalization();

  const timelineItems = [
    {
      icon: FileSearch,
      title:
        locale === "ar"
          ? "تحليل بيانات الاستكشاف"
          : "Discovery data analyzed",
      description:
        locale === "ar"
          ? "تم استخراج الأولويات والفجوات والإشارات التنفيذية."
          : "Executive priorities, gaps, and signals were extracted.",
      time:
        locale === "ar"
          ? "منذ 5 دقائق"
          : "5 minutes ago",
      tone:
        "bg-[var(--brand-subtle)] text-[var(--brand-primary)]",
    },
    {
      icon: BrainCircuit,
      title:
        locale === "ar"
          ? "تحديث الرسم المعرفي"
          : "Knowledge graph updated",
      description:
        locale === "ar"
          ? "تم ربط بيانات المؤسسة بالسياسات والقرارات والمخاطر."
          : "Enterprise data was connected to policies, decisions, and risks.",
      time:
        locale === "ar"
          ? "منذ 18 دقيقة"
          : "18 minutes ago",
      tone:
        "bg-[var(--success-background)] text-[var(--success)]",
    },
    {
      icon: Lightbulb,
      title:
        locale === "ar"
          ? "إنشاء توصية تنفيذية"
          : "Executive recommendation generated",
      description:
        locale === "ar"
          ? "اقتراح استكمال قاعدة المعرفة وربط القرارات بمسؤولي التنفيذ."
          : "Recommended completing the knowledge base and assigning execution owners.",
      time:
        locale === "ar"
          ? "منذ 32 دقيقة"
          : "32 minutes ago",
      tone:
        "bg-[var(--warning-background)] text-[var(--warning)]",
    },
    {
      icon: MessageSquareText,
      title:
        locale === "ar"
          ? "تسجيل محادثة تنفيذية"
          : "Executive conversation recorded",
      description:
        locale === "ar"
          ? "تم حفظ السؤال والإجابة والمصادر ومستوى الثقة."
          : "The question, response, sources, and confidence were retained.",
      time:
        locale === "ar"
          ? "منذ ساعة"
          : "1 hour ago",
      tone:
        "bg-[var(--surface-muted)] text-[var(--text-secondary)]",
    },
  ];

  return (
    <section className="rounded-[26px] border border-[var(--border-default)] bg-[var(--surface)] p-6 shadow-[var(--shadow-small)]">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[var(--brand-subtle)] text-[var(--brand-primary)]">
            <Clock3 size={20} />
          </span>

          <div>
            <h2 className="text-base font-black text-[var(--text-primary)]">
              {locale === "ar"
                ? "سجل الذكاء والقرارات"
                : "Intelligence & Decision Timeline"}
            </h2>

            <p className="mt-1 text-xs leading-6 text-[var(--text-muted)]">
              {locale === "ar"
                ? "آخر الأنشطة التي نفذها Corporate Brain داخل المؤسسة."
                : "Recent intelligence activities completed by Corporate Brain."}
            </p>
          </div>
        </div>

        <span className="inline-flex items-center gap-2 rounded-full bg-[var(--surface-muted)] px-3 py-2 text-[10px] font-black text-[var(--text-secondary)]">
          <CheckCircle2 size={13} />
          {locale === "ar"
            ? "آخر 24 ساعة"
            : "Last 24 Hours"}
        </span>
      </div>

      <div className="mt-6 space-y-1">
        {timelineItems.map((item, index) => {
          const Icon = item.icon;
          const isLast = index === timelineItems.length - 1;

          return (
            <div
              key={item.title}
              className="relative flex gap-4 pb-6 last:pb-0"
            >
              {!isLast && (
                <span className="absolute inset-inline-start-[19px] top-11 h-[calc(100%-28px)] w-px bg-[var(--border-default)]" />
              )}

              <span
                className={`relative z-10 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${item.tone}`}
              >
                <Icon size={17} />
              </span>

              <div className="min-w-0 flex-1 rounded-2xl border border-[var(--border-default)] bg-[var(--surface-muted)] p-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h3 className="text-xs font-black text-[var(--text-primary)]">
                      {item.title}
                    </h3>

                    <p className="mt-2 text-[11px] leading-5 text-[var(--text-muted)]">
                      {item.description}
                    </p>
                  </div>

                  <span className="shrink-0 text-[10px] font-bold text-[var(--text-muted)]">
                    {item.time}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}