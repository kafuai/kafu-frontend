"use client";

import { Bot, FileText, ShieldCheck, UserRound } from "lucide-react";
import { useLocalization } from "@/components/localization/LocalizationContext";
import { useAppCopy } from "./useAppCopy";

interface ConversationProps {
  companyName: string;
  userPrompt: string;
  aiResponse: string;
  aiLoading: boolean;
  aiError: string;
}

export default function Conversation({ companyName, userPrompt, aiResponse, aiLoading, aiError }: ConversationProps) {
  const { locale } = useLocalization();
  const copy = useAppCopy(locale, companyName).conversation;
  const displayedPrompt = userPrompt || copy.defaultPrompt;

  return (
    <section className="flex min-h-[500px] flex-col overflow-hidden rounded-[22px] border border-[var(--border-default)] bg-[var(--surface)] shadow-[var(--shadow-small)]">
      <div className="flex items-center justify-between gap-4 border-b border-[var(--border-default)] px-5 py-4 md:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-[13px] bg-[var(--text-primary)] text-[var(--surface)]">
            <Bot size={19} />
          </span>
          <div className="min-w-0">
            <h2 className="truncate text-sm font-extrabold text-[var(--text-primary)]">{copy.title}</h2>
            <p className="mt-1 truncate text-xs text-[var(--text-muted)]">{copy.subtitle}</p>
          </div>
        </div>
        <div className="inline-flex shrink-0 items-center gap-2 rounded-full bg-[var(--success-background)] px-3 py-2 text-[11px] font-extrabold text-[var(--success)]">
          <ShieldCheck size={14} />
          {aiLoading ? copy.statusAnalyzing : copy.statusGrounded}
        </div>
      </div>
      <div className="flex-1 space-y-5 overflow-y-auto p-5 md:p-6">
        <div className="flex items-start gap-3">
          <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--surface-muted)] text-[var(--text-secondary)]">
            <UserRound size={17} />
          </span>
          <div className="max-w-[86%] rounded-2xl rounded-ss-sm bg-[var(--surface-muted)] px-4 py-3.5">
            <p className="text-sm font-semibold leading-7 text-[var(--text-primary)]">{displayedPrompt}</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--brand-subtle)] text-[var(--brand-primary)]">
            <Bot size={18} />
          </span>
          <div className="max-w-[94%] rounded-2xl rounded-ss-sm border border-[var(--border-default)] bg-[var(--surface)] px-5 py-5 shadow-[var(--shadow-small)]">
            {aiLoading ? (
              <p className="text-sm leading-8 text-[var(--text-secondary)]">{copy.analyzingDesc}</p>
            ) : aiResponse ? (
              <p className="whitespace-pre-line text-sm leading-8 text-[var(--text-secondary)]">{aiResponse}</p>
            ) : (
              <p className="text-sm leading-8 text-[var(--text-secondary)]">{aiError || copy.errorDesc}</p>
            )}
            {!aiLoading && aiResponse && (
              <div className="mt-5 flex flex-wrap gap-2 border-t border-[var(--border-default)] pt-4">
                <span className="inline-flex items-center gap-2 rounded-full bg-[var(--brand-subtle)] px-3 py-2 text-[10px] font-extrabold text-[var(--brand-primary)]">
                  <FileText size={13} /> {copy.badgeEnterprise}
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-[var(--surface-muted)] px-3 py-2 text-[10px] font-extrabold text-[var(--text-muted)]">
                  <ShieldCheck size={13} /> Grounded AI
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}