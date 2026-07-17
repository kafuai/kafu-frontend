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

  return (
    <section className="rounded-[24px] border border-[var(--border-default)] bg-[var(--surface)] p-4 shadow-[var(--shadow-medium)]">
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
          locale === "ar"
            ? "ط§ط³ط£ظ„ Corporate Brain ط¹ظ† ط§ظ„ط£ط¯ط§ط، ط£ظˆ ط§ظ„ظ…ط®ط§ط·ط± ط£ظˆ ط§ظ„ظ‚ط±ط§ط±ط§طھ ط£ظˆ ظ…ط¹ط±ظپط© ط§ظ„ظ…ط¤ط³ط³ط©..."
            : "Ask Corporate Brain about performance, risks, decisions, or enterprise knowledge..."
        }
        className="w-full resize-none border-0 bg-transparent px-2 py-2 text-sm leading-7 text-[var(--text-primary)] outline-none placeholder:text-[var(--text-muted)]"
      />

      <div className="mt-3 flex items-center justify-between gap-4 border-t border-[var(--border-default)] pt-4">
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl text-[var(--text-muted)] transition hover:bg-[var(--surface-muted)] hover:text-[var(--text-primary)]"
            aria-label={
              locale === "ar"
                ? "ط¥ط±ظپط§ظ‚ ظ…ظ„ظپ"
                : "Attach file"
            }
          >
            <Paperclip size={18} />
          </button>

          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl text-[var(--text-muted)] transition hover:bg-[var(--surface-muted)] hover:text-[var(--text-primary)]"
            aria-label={
              locale === "ar"
                ? "ط¥ط¯ط®ط§ظ„ طµظˆطھظٹ"
                : "Voice input"
            }
          >
            <Mic size={18} />
          </button>

          <span className="hidden items-center gap-2 text-[11px] font-semibold text-[var(--text-muted)] sm:inline-flex">
            <Sparkles size={14} />

            {locale === "ar"
              ? "ظ…ط¯ط¹ظˆظ… ط¨ظ…ط¹ط±ظپط© ط§ظ„ظ…ط¤ط³ط³ط©"
              : "Grounded in enterprise knowledge"}
          </span>
        </div>

        <button
          type="button"
          onClick={onSubmit}
          disabled={!value.trim()}
          className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-[var(--text-primary)] px-5 text-xs font-black text-[var(--surface)] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {locale === "ar" ? "طھط­ظ„ظٹظ„" : "Analyze"}
          <ArrowUp size={17} />
        </button>
      </div>
    </section>
  );
}
