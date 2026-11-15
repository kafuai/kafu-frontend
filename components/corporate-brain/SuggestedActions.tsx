"use client";

import { FileCheck2, Lightbulb, SearchCheck, ShieldAlert, TrendingUp } from "lucide-react";
import { useLocalization } from "@/components/localization/LocalizationContext";
import { useAppCopy } from "./useAppCopy";

interface SuggestedActionsProps {
  onSelect: (prompt: string) => void;
}

export default function SuggestedActions({ onSelect }: SuggestedActionsProps) {
  const { locale } = useLocalization();
  const copy = useAppCopy(locale).actions;

  const actionsData = [
    { icon: TrendingUp, ...copy.items[0] },
    { icon: ShieldAlert, ...copy.items[1] },
    { icon: FileCheck2, ...copy.items[2] },
    { icon: Lightbulb, ...copy.items[3] },
  ];

  return (
    <section className="overflow-hidden rounded-3xl border border-[var(--border-default)] bg-[var(--surface)] shadow-[var(--shadow-small)]">
      <div className="border-b border-[var(--border-default)] px-5 py-4">
        <div className="flex items-start gap-3">
          <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--brand-subtle)] text-[var(--brand-primary)]">
            <SearchCheck size={19} />
          </span>
          <div className="min-w-0">
            <h2 className="text-sm font-black text-[var(--text-primary)]">{copy.title}</h2>
            <p className="mt-1 text-xs leading-6 text-[var(--text-muted)]">{copy.desc}</p>
          </div>
        </div>
      </div>
      <div className="grid gap-3 p-5 sm:grid-cols-2 xl:grid-cols-1">
        {actionsData.map((action, index) => {
          const Icon = action.icon;
          return (
            <button
              key={action.title}
              type="button"
              onClick={() => onSelect(action.prompt)}
              className="group flex min-h-[72px] w-full items-center gap-3 rounded-2xl border border-[var(--border-default)] bg-[var(--surface-muted)] p-3.5 text-start transition duration-200 hover:-translate-y-0.5 hover:border-[var(--brand-primary)] hover:bg-[var(--brand-subtle)]"
            >
              <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--surface)] text-[var(--brand-primary)] shadow-[var(--shadow-small)]">
                <Icon size={17} />
              </span>
              <span className="min-w-0 flex-1 text-xs font-extrabold leading-5 text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]">
                {action.title}
              </span>
              <span className="shrink-0 text-[10px] font-black text-[var(--text-muted)]">
                {String(index + 1).padStart(2, "0")}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}