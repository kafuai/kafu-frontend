"use client";

import { RefreshCw, ShieldCheck, Sparkles } from "lucide-react";
import { useLocalization } from "@/components/localization/LocalizationContext";
import { useAppCopy } from "./useAppCopy";

interface LiveInsightProps {
  aiInsight: string;
  aiLoading: boolean;
  aiError: string;
  aiCitations: Array<{ evidenceId: string; source: string; label: string }>;
  onGenerate: () => void;
}

export default function LiveInsight({ aiInsight, aiLoading, aiError, aiCitations, onGenerate }: LiveInsightProps) {
  const { locale } = useLocalization();
  const copy = useAppCopy(locale).page.aiInsight;

  return (
    <section className="mx-auto w-full max-w-[1500px] px-5 pt-6 md:px-8">
      <div className="relative overflow-hidden rounded-[20px] border border-[var(--border-default)] bg-[var(--surface)] px-6 py-5 shadow-[var(--shadow-small)]">
        <div aria-hidden="true" className="absolute inset-y-0 start-0 w-1 bg-[var(--brand-primary)]" />
        <div className="flex items-start gap-4">
          <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--brand-subtle)] text-[var(--brand-primary)]">
            {aiLoading ? <RefreshCw className="animate-spin" size={20} /> : <Sparkles size={20} />}
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-sm font-extrabold text-[var(--text-primary)]">{copy.title}</p>
              {!aiLoading && (
                <button
                  type="button"
                  onClick={onGenerate}
                  className="inline-flex min-h-8 items-center justify-center gap-2 rounded-lg border border-[var(--border-default)] bg-[var(--surface)] px-3 text-[10px] font-extrabold text-[var(--brand-primary)] transition hover:border-[var(--brand-primary)] hover:bg-[var(--brand-subtle)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)] focus-visible:ring-offset-2"
                >
                  {aiInsight ? <RefreshCw aria-hidden="true" size={13} /> : <Sparkles aria-hidden="true" size={13} />}
                  {aiInsight ? copy.regenerateBtn : copy.generateBtn}
                </button>
              )}
              {!aiLoading && aiInsight && (
                <span className="rounded-full bg-[var(--success-background)] px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[0.08em] text-[var(--success)]">
                  {copy.liveBadge}
                </span>
              )}
            </div>
            {aiLoading ? (
              <p className="mt-2 text-sm leading-7 text-[var(--text-secondary)]">{copy.loadingText}</p>
            ) : aiInsight ? (
              <div className="mt-2">
                <p className="whitespace-pre-line text-sm leading-7 text-[var(--text-secondary)]">{aiInsight}</p>
                {aiCitations.length > 0 && (
                  <div className="mt-4">
                    <p className="mb-2 text-[10px] font-extrabold uppercase tracking-[0.1em] text-[var(--text-muted)]">{copy.sourcesTitle}</p>
                    <div className="flex flex-wrap gap-2">
                      {aiCitations.map((citation) => (
                        <span key={citation.evidenceId} title={citation.label} className="inline-flex items-center gap-2 rounded-full border border-[var(--border-default)] bg-[var(--surface)] px-3 py-1.5 text-[10px] font-bold text-[var(--text-secondary)]">
                          <ShieldCheck aria-hidden="true" size={13} className="shrink-0 text-[var(--success)]" />
                          <span>{citation.source}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <p className="mt-2 text-sm leading-7 text-[var(--text-secondary)]">{aiError || copy.promptText}</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}