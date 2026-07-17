"use client";

import {
  Bot,
  CheckCircle2,
  FileText,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import { useLocalization } from "@/components/localization/LocalizationContext";

interface CorporateBrainConversationProps {
  companyName: string;
  userPrompt: string;
}

export default function CorporateBrainConversation({
  companyName,
  userPrompt,
}: CorporateBrainConversationProps) {
  const { locale } = useLocalization();

  const displayedPrompt =
    userPrompt ||
    (locale === "ar"
      ? "ظ…ط§ ط£ظ‡ظ… ط§ظ„ط£ظˆظ„ظˆظٹط§طھ ط§ظ„طھظ†ظپظٹط°ظٹط© ط§ظ„طھظٹ ظٹط¬ط¨ ط§ظ„طھط±ظƒظٹط² ط¹ظ„ظٹظ‡ط§ ط§ظ„ط¢ظ†طں"
      : "What are the most important executive priorities right now?");

  const priorities =
    locale === "ar"
      ? [
          "ط§ط³طھظƒظ…ط§ظ„ ظ…طµط§ط¯ط± ط§ظ„ظ…ط¹ط±ظپط© ط§ظ„ط¯ط§ط®ظ„ظٹط©",
          "طھظˆط«ظٹظ‚ ط§ظ„ط³ظٹط§ط³ط§طھ ظˆط§ظ„ط¥ط¬ط±ط§ط،ط§طھ ط§ظ„ط­ط±ط¬ط©",
          "ط±ط¨ط· ط§ظ„ظ‚ط±ط§ط±ط§طھ ط¨ظ…ط¤ط´ط±ط§طھ ط§ظ„ط£ط¯ط§ط،",
        ]
      : [
          "Complete internal knowledge sources",
          "Document critical policies and procedures",
          "Connect decisions to performance indicators",
        ];

  return (
    <section className="flex min-h-[520px] flex-col rounded-[26px] border border-[var(--border-default)] bg-[var(--surface)] shadow-[var(--shadow-small)]">
      <div className="flex items-center justify-between gap-4 border-b border-[var(--border-default)] px-6 py-5">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--text-primary)] text-[var(--surface)]">
            <Bot size={21} />
          </span>

          <div>
            <h2 className="text-sm font-black text-[var(--text-primary)]">
              {locale === "ar"
                ? "ط§ظ„ظ…ط³ط§ط¹ط¯ ط§ظ„طھظ†ظپظٹط°ظٹ ط§ظ„ط°ظƒظٹ"
                : "Executive AI Copilot"}
            </h2>

            <p className="mt-1 text-xs text-[var(--text-muted)]">
              {locale === "ar"
                ? "ط¥ط¬ط§ط¨ط§طھ ظ…ط¨ظ†ظٹط© ط¹ظ„ظ‰ ظ…ط¹ط±ظپط© ط§ظ„ظ…ط¤ط³ط³ط©"
                : "Answers grounded in enterprise knowledge"}
            </p>
          </div>
        </div>

        <div className="inline-flex items-center gap-2 rounded-full bg-[var(--success-background)] px-3 py-2 text-[11px] font-black text-[var(--success)]">
          <ShieldCheck size={14} />

          {locale === "ar" ? "ظ…ظˆط«ظ‘ظ‚" : "Grounded"}
        </div>
      </div>

      <div className="flex-1 space-y-6 overflow-y-auto p-6">
        <div className="flex items-start gap-3">
          <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--surface-muted)] text-[var(--text-secondary)]">
            <UserRound size={17} />
          </span>

          <div className="max-w-[85%] rounded-2xl rounded-ss-sm bg-[var(--surface-muted)] px-5 py-4">
            <p className="text-sm font-semibold leading-7 text-[var(--text-primary)]">
              {displayedPrompt}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--brand-subtle)] text-[var(--brand-primary)]">
            <Bot size={18} />
          </span>

          <div className="max-w-[92%] rounded-2xl rounded-ss-sm border border-[var(--border-default)] bg-[var(--surface)] px-5 py-5 shadow-[var(--shadow-small)]">
            <p className="text-sm leading-8 text-[var(--text-secondary)]">
              {locale === "ar"
                ? `ط¨ظ†ط§ط،ظ‹ ط¹ظ„ظ‰ ط¨ظٹط§ظ†ط§طھ ${companyName} ظˆظ†طھط§ط¦ط¬ ط§ظ„ط§ط³طھظƒط´ط§ظپ ط§ظ„ط­ط§ظ„ظٹط©طŒ ظپط¥ظ† ط§ظ„ط£ظˆظ„ظˆظٹط© ط§ظ„طھظ†ظپظٹط°ظٹط© ظ‡ظٹ طھط­ظˆظٹظ„ ط§ظ„ظ…ط¹ط±ظپط© ط§ظ„ظ…طھظپط±ظ‚ط© ط¥ظ„ظ‰ ظ†ط¸ط§ظ… ظ…ظˆط­ط¯ ظ„ط¯ط¹ظ… ط§ظ„ظ‚ط±ط§ط±ط§طھ. ظˆظٹط­ط¯ط¯ ط§ظ„طھط­ظ„ظٹظ„ ط«ظ„ط§ط« ط£ظˆظ„ظˆظٹط§طھ ط±ط¦ظٹط³ظٹط©: ط§ط³طھظƒظ…ط§ظ„ ظ…طµط§ط¯ط± ط§ظ„ظ…ط¹ط±ظپط© ط§ظ„ط¯ط§ط®ظ„ظٹط©طŒ ظˆطھظˆط«ظٹظ‚ ط§ظ„ط³ظٹط§ط³ط§طھ ظˆط§ظ„ط¥ط¬ط±ط§ط،ط§طھطŒ ظˆط±ط¨ط· ظ…ط¤ط´ط±ط§طھ ط§ظ„ط£ط¯ط§ط، ط¨ظ…ط±ظƒط² ط§ظ„ظ‚ظٹط§ط¯ط© ط§ظ„طھظ†ظپظٹط°ظٹ.`
                : `Based on current ${companyName} data and discovery insights, the immediate executive priority is to transform fragmented knowledge into a unified decision system. The analysis identifies three priorities: completing internal knowledge sources, documenting policies and procedures, and connecting performance indicators to the executive command center.`}
            </p>

            <div className="mt-5 grid gap-3">
              {priorities.map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 rounded-xl bg-[var(--surface-muted)] px-4 py-3"
                >
                  <CheckCircle2
                    size={16}
                    className="shrink-0 text-[var(--success)]"
                  />

                  <span className="text-xs font-bold text-[var(--text-secondary)]">
                    {item}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-5 flex flex-wrap gap-2 border-t border-[var(--border-default)] pt-4">
              <span className="inline-flex items-center gap-2 rounded-full bg-[var(--brand-subtle)] px-3 py-2 text-[10px] font-extrabold text-[var(--brand-primary)]">
                <FileText size={13} />

                {locale === "ar"
                  ? "ط¨ظٹط§ظ†ط§طھ ط§ظ„ط§ط³طھظƒط´ط§ظپ"
                  : "Discovery Data"}
              </span>

              <span className="inline-flex items-center gap-2 rounded-full bg-[var(--surface-muted)] px-3 py-2 text-[10px] font-extrabold text-[var(--text-muted)]">
                {locale === "ar"
                  ? "ظ…ط³طھظˆظ‰ ط§ظ„ط«ظ‚ط© 92%"
                  : "92% Confidence"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
