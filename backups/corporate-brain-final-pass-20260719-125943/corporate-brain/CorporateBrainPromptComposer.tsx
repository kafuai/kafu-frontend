"use client";

import {
  ArrowUp,
  Mic,
  Paperclip,
  Sparkles,
} from "lucide-react";

import { useLocalization } from "@/components/localization/LocalizationContext";

interface CorporateBrainPromptComposerProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
}

export default function CorporateBrainPromptComposer({
  value,
  onChange,
  onSubmit,
}: CorporateBrainPromptComposerProps) {
  const { locale } = useLocalization();
  const isArabic = locale === "ar";
  const canSubmit = value.trim().length > 0;

  return (
    <section className="overflow-hidden rounded-3xl border border-[var(--border-default)] bg-[var(--surface)] shadow-[var(--shadow-medium)] transition focus-within:border-[var(--brand-primary)] focus-within:ring-2 focus-within:ring-[var(--brand-subtle)]">
      <div className="px-4 pt-4 md:px-5">
        <textarea
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              onSubmit();
            }
          }}
          rows={3}
          placeholder={
            isArabic
              ? "اسأل Corporate Brain عن الأداء أو المخاطر أو القرارات أو معرفة المؤسسة..."
              : "Ask Corporate Brain about performance, risks, decisions, or enterprise knowledge..."
          }
          aria-label={
            isArabic
              ? "اكتب سؤالك إلى العقل المؤسسي"
              : "Enter your Corporate Brain question"
          }
          className="min-h-[96px] w-full resize-none border-0 bg-transparent px-1 py-2 text-sm leading-7 text-[var(--text-primary)] outline-none placeholder:text-[var(--text-muted)]"
        />
      </div>

      <div className="flex items-center justify-between gap-4 border-t border-[var(--border-default)] bg-[var(--surface-muted)] px-4 py-3 md:px-5">
        <div className="flex min-w-0 items-center gap-2">
          <button
            type="button"
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-[var(--text-muted)] transition hover:bg-[var(--surface)] hover:text-[var(--text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)]"
            aria-label={isArabic ? "إرفاق ملف" : "Attach file"}
          >
            <Paperclip size={17} />
          </button>

          <button
            type="button"
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-[var(--text-muted)] transition hover:bg-[var(--surface)] hover:text-[var(--text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)]"
            aria-label={isArabic ? "إدخال صوتي" : "Voice input"}
          >
            <Mic size={17} />
          </button>

          <span className="hidden min-w-0 items-center gap-2 text-[11px] font-semibold text-[var(--text-muted)] sm:inline-flex">
            <Sparkles size={14} className="shrink-0" />

            <span className="truncate">
              {isArabic
                ? "مدعوم بمعرفة المؤسسة"
                : "Grounded in enterprise knowledge"}
            </span>
          </span>
        </div>

        <button
          type="button"
          onClick={onSubmit}
          disabled={!canSubmit}
          className="inline-flex min-h-10 shrink-0 items-center gap-2 rounded-xl !bg-slate-900 px-5 text-xs font-black !text-white shadow-sm transition hover:!bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {isArabic ? "تحليل" : "Analyze"}
          <ArrowUp size={16} />
        </button>
      </div>
    </section>
  );
}