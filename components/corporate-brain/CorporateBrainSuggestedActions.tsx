"use client";

import {
  FileCheck2,
  Lightbulb,
  SearchCheck,
  ShieldAlert,
  TrendingUp,
} from "lucide-react";

import { useLocalization } from "@/components/localization/LocalizationContext";

interface CorporateBrainSuggestedActionsProps {
  onSelect: (prompt: string) => void;
}

export default function CorporateBrainSuggestedActions({
  onSelect,
}: CorporateBrainSuggestedActionsProps) {
  const { locale } = useLocalization();

  const actions = [
    {
      icon: TrendingUp,
      title:
        locale === "ar"
          ? "طھط­ظ„ظٹظ„ ط£ط¯ط§ط، ط§ظ„ط´ط±ظƒط©"
          : "Analyze company performance",
      prompt:
        locale === "ar"
          ? "ط­ظ„ظ„ ط£ط¯ط§ط، ط§ظ„ط´ط±ظƒط© ظˆط­ط¯ط¯ ط£ظ‡ظ… ط«ظ„ط§ط« ظپط±طµ ظ„ظ„طھط­ط³ظٹظ†."
          : "Analyze company performance and identify the top three improvement opportunities.",
    },
    {
      icon: ShieldAlert,
      title:
        locale === "ar"
          ? "ظ…ط±ط§ط¬ط¹ط© ظ…ط®ط§ط·ط± ط§ظ„ظ…ط¤ط³ط³ط©"
          : "Review enterprise risks",
      prompt:
        locale === "ar"
          ? "ظ…ط§ ط£ظ‡ظ… ط§ظ„ظ…ط®ط§ط·ط± ط§ظ„ظ…ط¤ط³ط³ظٹط© ط§ظ„طھظٹ طھطھط·ظ„ط¨ طھط¯ط®ظ„ظ‹ط§ طھظ†ظپظٹط°ظٹظ‹ط§طں"
          : "What enterprise risks currently require executive intervention?",
    },
    {
      icon: FileCheck2,
      title:
        locale === "ar"
          ? "ظ…ط±ط§ط¬ط¹ط© ط§ظ„ط³ظٹط§ط³ط§طھ ط§ظ„ط¯ط§ط®ظ„ظٹط©"
          : "Review internal policies",
      prompt:
        locale === "ar"
          ? "ط±ط§ط¬ط¹ ط¬ط§ظ‡ط²ظٹط© ط§ظ„ط³ظٹط§ط³ط§طھ ط§ظ„ط¯ط§ط®ظ„ظٹط© ظˆط­ط¯ط¯ ط§ظ„ظپط¬ظˆط§طھ ط§ظ„ظ…ط¹ط±ظپظٹط©."
          : "Review internal policy readiness and identify knowledge gaps.",
    },
    {
      icon: Lightbulb,
      title:
        locale === "ar"
          ? "ط§ظ‚طھط±ط§ط­ ظ‚ط±ط§ط± طھظ†ظپظٹط°ظٹ"
          : "Recommend a decision",
      prompt:
        locale === "ar"
          ? "ط§ظ‚طھط±ط­ ط§ظ„ظ‚ط±ط§ط± ط§ظ„طھظ†ظپظٹط°ظٹ ط§ظ„ط£ط¹ظ„ظ‰ ط£ظˆظ„ظˆظٹط© ط¨ظ†ط§ط،ظ‹ ط¹ظ„ظ‰ ط¨ظٹط§ظ†ط§طھ ط§ظ„ظ…ط¤ط³ط³ط©."
          : "Recommend the highest-priority executive decision based on enterprise data.",
    },
  ];

  return (
    <section className="rounded-[24px] border border-[var(--border-default)] bg-[var(--surface)] p-5 shadow-[var(--shadow-small)]">
      <div className="flex items-center gap-3">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--brand-subtle)] text-[var(--brand-primary)]">
          <SearchCheck size={19} />
        </span>

        <div>
          <h2 className="text-sm font-black text-[var(--text-primary)]">
            {locale === "ar"
              ? "ط§ط³طھظپط³ط§ط±ط§طھ طھظ†ظپظٹط°ظٹط© ظ…ظ‚طھط±ط­ط©"
              : "Suggested Executive Queries"}
          </h2>

          <p className="mt-1 text-xs text-[var(--text-muted)]">
            {locale === "ar"
              ? "ط§ط¨ط¯ط£ ط¨طھط­ظ„ظٹظ„ ط¬ط§ظ‡ط² ط£ظˆ ط§ظƒطھط¨ ط³ط¤ط§ظ„ظƒ ط§ظ„ط®ط§طµ."
              : "Start with a ready analysis or ask your own question."}
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <button
              key={action.title}
              type="button"
              onClick={() => onSelect(action.prompt)}
              className="group flex items-center gap-3 rounded-2xl border border-[var(--border-default)] bg-[var(--surface-muted)] p-4 text-start transition hover:-translate-y-0.5 hover:border-[var(--brand-primary)] hover:bg-[var(--brand-subtle)]"
            >
              <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--surface)] text-[var(--brand-primary)] shadow-[var(--shadow-small)]">
                <Icon size={17} />
              </span>

              <span className="text-xs font-extrabold leading-5 text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]">
                {action.title}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
