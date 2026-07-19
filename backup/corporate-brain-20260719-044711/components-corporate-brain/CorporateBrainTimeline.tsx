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
  const isArabic = locale === "ar";

  const timelineItems = [
    {
      icon: FileSearch,
      title: isArabic
        ? "تحليل بيانات الاستكشاف"
        : "Discovery data analyzed",
      description: isArabic
        ? "تم استخراج الأولويات والفجوات والإشارات التنفيذية."
        : "Executive priorities, gaps, and signals were extracted.",
      time: isArabic
        ? "منذ 5 دقائق"
        : "5 minutes ago",
      tone:
        "border-[var(--brand-primary)]/20 bg-[var(--brand-subtle)] text-[var(--brand-primary)]",
    },
    {
      icon: BrainCircuit,
      title: isArabic
        ? "تحديث الرسم المعرفي"
        : "Knowledge graph updated",
      description: isArabic
        ? "تم ربط بيانات المؤسسة بالسياسات والقرارات والمخاطر."
        : "Enterprise data was connected to policies, decisions, and risks.",
      time: isArabic
        ? "منذ 18 دقيقة"
        : "18 minutes ago",
      tone:
        "border-[var(--success)]/20 bg-[var(--success-background)] text-[var(--success)]",
    },
    {
      icon: Lightbulb,
      title: isArabic
        ? "إنشاء توصية تنفيذية"
        : "Executive recommendation generated",
      description: isArabic
        ? "تم اقتراح استكمال قاعدة المعرفة وربط القرارات بمسؤولي التنفيذ."
        : "Recommended completing the knowledge base and assigning execution owners.",
      time: isArabic
        ? "منذ 32 دقيقة"
        : "32 minutes ago",
      tone:
        "border-[var(--warning)]/20 bg-[var(--warning-background)] text-[var(--warning)]",
    },
    {
      icon: MessageSquareText,
      title: isArabic
        ? "تسجيل محادثة تنفيذية"
        : "Executive conversation recorded",
      description: isArabic
        ? "تم حفظ السؤال والإجابة والمصادر ومستوى الثقة."
        : "The question, response, sources, and confidence were retained.",
      time: isArabic
        ? "منذ ساعة"
        : "1 hour ago",
      tone:
        "border-[var(--border-default)] bg-[var(--surface-muted)] text-[var(--text-secondary)]",
    },
  ];

  return (
    <section className="overflow-hidden rounded-3xl border border-[var(--border-default)] bg-[var(--surface)] shadow-[var(--shadow-small)]">
      <div className="border-b border-[var(--border-default)] px-5 py-5 md:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex min-w-0 items-start gap-3">
            <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--brand-subtle)] text-[var(--brand-primary)]">
              <Clock3 size={20} />
            </span>

            <div className="min-w-0">
              <h2 className="text-base font-black text-[var(--text-primary)]">
                {isArabic
                  ? "سجل الذكاء والقرارات"
                  : "Intelligence & Decision Timeline"}
              </h2>

              <p className="mt-1 max-w-3xl text-xs leading-6 text-[var(--text-muted)]">
                {isArabic
                  ? "أحدث الأنشطة التي نفذها Corporate Brain داخل المؤسسة."
                  : "Recent intelligence activities completed by Corporate Brain."}
              </p>
            </div>
          </div>

          <span className="inline-flex w-fit shrink-0 items-center gap-2 rounded-full border border-[var(--border-default)] bg-[var(--surface-muted)] px-3 py-1.5 text-[10px] font-black text-[var(--text-secondary)]">
            <CheckCircle2 size={13} />
            {isArabic
              ? "آخر 24 ساعة"
              : "Last 24 Hours"}
          </span>
        </div>
      </div>

      <div className="p-5 md:p-6">
        <div className="space-y-1">
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
                  className={`relative z-10 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${item.tone}`}
                >
                  <Icon size={17} />
                </span>

                <div className="min-w-0 flex-1 rounded-2xl border border-[var(--border-default)] bg-[var(--surface-muted)] p-4">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                    <div className="min-w-0">
                      <h3 className="text-xs font-black leading-5 text-[var(--text-primary)]">
                        {item.title}
                      </h3>

                      <p className="mt-2 text-[11px] leading-5 text-[var(--text-muted)]">
                        {item.description}
                      </p>
                    </div>

                    <span className="shrink-0 whitespace-nowrap text-[10px] font-bold text-[var(--text-muted)]">
                      {item.time}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}