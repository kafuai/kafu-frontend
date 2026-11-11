// QuestionProgress.tsx
import { BrainCircuit } from "lucide-react";

type QuestionProgressProps = {
  t: any;
  currentQuestion: number;
  questionsCount: number;
  progress: number;
};

export default function QuestionProgress({ t, currentQuestion, questionsCount, progress }: QuestionProgressProps) {
  return (
    <>
      <div className="flex flex-col gap-5 border-b border-[var(--border-default)] pb-7 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.16em] text-[var(--brand-primary)]">
            {t.progress.executiveQuestion}
          </p>
          <h2 className="mt-2 text-2xl font-black text-[var(--text-primary)] sm:text-3xl">
            {currentQuestion + 1}
            <span className="mx-2 text-base text-[var(--text-muted)]">/</span>
            {questionsCount}
          </h2>
        </div>

        <div className="w-full sm:max-w-[320px]">
          <div className="mb-2 flex items-center justify-between text-xs font-black text-[var(--text-muted)]">
            <span>{t.progress.sessionProgress}</span>
            <span dir="ltr">{Math.round(progress)}%</span>
          </div>
          <div
            className="h-2.5 overflow-hidden rounded-full bg-[var(--surface-muted)]"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(progress)}
          >
            <div
              className="h-full rounded-full bg-emerald-600 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      <div className="pt-8">
        <div className="flex items-start gap-4">
          <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
            <BrainCircuit size={22} />
          </span>
          <div>
            <p className="text-xs font-black text-emerald-700">{t.progress.discoveryBadge}</p>
            <h3 className="mt-2 text-xl font-black leading-9 text-[var(--text-primary)] sm:text-2xl">
              {t.questions[currentQuestion]}
            </h3>
          </div>
        </div>
      </div>
    </>
  );
}