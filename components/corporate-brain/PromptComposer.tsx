"use client";

import { ArrowUp, Mic, Paperclip, Sparkles } from "lucide-react";
import { useLocalization } from "@/components/localization/LocalizationContext";
import { useAppCopy } from "./useAppCopy";

interface PromptComposerProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
}

export default function PromptComposer({ value, onChange, onSubmit }: PromptComposerProps) {
  const { locale } = useLocalization();
  const copy = useAppCopy(locale).composer;
  const canSubmit = value.trim().length > 0;

  return (
    <section className="overflow-hidden rounded-[20px] border border-[var(--border-default)] bg-[var(--surface)] shadow-[var(--shadow-small)] transition focus-within:border-[var(--brand-primary)] focus-within:ring-2 focus-within:ring-[var(--brand-subtle)]">
      <div className="px-4 pt-3 md:px-5">
        <textarea
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey && canSubmit) {
              event.preventDefault();
              onSubmit();
            }
          }}
          rows={2}
          placeholder={copy.placeholder}
          aria-label={copy.ariaLabel}
          className="min-h-[76px] w-full resize-none border-0 bg-transparent px-1 py-2 text-sm leading-7 text-[var(--text-primary)] outline-none placeholder:text-[var(--text-muted)]"
        />
      </div>
      <div className="flex items-center justify-between gap-4 border-t border-[var(--border-default)] bg-[var(--surface-muted)] px-4 py-3 md:px-5">
        <div className="flex min-w-0 items-center gap-2">
          <button type="button" disabled title={copy.attachDisabled} className="inline-flex h-9 w-9 shrink-0 cursor-not-allowed items-center justify-center rounded-xl text-[var(--text-muted)] opacity-50">
            <Paperclip aria-hidden="true" size={17} />
          </button>
          <button type="button" disabled title={copy.voiceDisabled} className="inline-flex h-9 w-9 shrink-0 cursor-not-allowed items-center justify-center rounded-xl text-[var(--text-muted)] opacity-50">
            <Mic aria-hidden="true" size={17} />
          </button>
          <span className="hidden min-w-0 items-center gap-2 text-[11px] font-semibold text-[var(--text-muted)] sm:inline-flex">
            <Sparkles size={14} className="shrink-0" />
            <span className="truncate">{copy.groundedBadge}</span>
          </span>
        </div>
        <button
          type="button"
          onClick={onSubmit}
          disabled={!canSubmit}
          className="inline-flex min-h-10 min-w-[112px] shrink-0 items-center justify-center gap-2 rounded-xl bg-[var(--brand-primary)] px-5 text-xs font-extrabold text-white shadow-sm transition hover:-translate-y-0.5 hover:opacity-90 disabled:cursor-not-allowed disabled:bg-[var(--surface-muted)] disabled:text-[var(--text-muted)]"
        >
          {copy.btnAnalyze}
          <ArrowUp aria-hidden="true" size={16} />
        </button>
      </div>
    </section>
  );
}