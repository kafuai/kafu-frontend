// ActionButtons.tsx
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";

type ActionButtonsProps = {
  t: any;
  isArabic: boolean;
  currentQuestion: number;
  questionsCount: number;
  loading: boolean;
  goToPreviousQuestion: () => void;
  goToNextQuestion: () => void;
  handleFinish: () => void;
  message: string;
  hasError: boolean;
};

export default function ActionButtons({
  t,
  isArabic,
  currentQuestion,
  questionsCount,
  loading,
  goToPreviousQuestion,
  goToNextQuestion,
  handleFinish,
  message,
  hasError,
}: ActionButtonsProps) {
  return (
    <>
      <div className="mt-8 flex flex-col-reverse gap-3 border-t border-[var(--border-default)] pt-7 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          disabled={currentQuestion === 0 || loading}
          onClick={goToPreviousQuestion}
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 text-sm font-black text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {isArabic ? <ArrowRight size={17} /> : <ArrowLeft size={17} />}
          {t.buttons.previous}
        </button>

        {currentQuestion < questionsCount - 1 ? (
          <button
            type="button"
            disabled={loading}
            onClick={goToNextQuestion}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-7 text-sm font-black text-white shadow-sm transition hover:bg-emerald-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-200 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {t.buttons.next}
            {isArabic ? <ArrowLeft size={17} /> : <ArrowRight size={17} />}
          </button>
        ) : (
          <button
            type="button"
            disabled={loading}
            onClick={handleFinish}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-emerald-700 bg-emerald-700 px-7 text-sm font-black text-white shadow-lg shadow-emerald-900/10 transition hover:border-emerald-800 hover:bg-emerald-800 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-200 disabled:cursor-not-allowed disabled:border-slate-300 disabled:bg-slate-300 disabled:text-slate-600 disabled:shadow-none"
          >
            <CheckCircle2 size={18} />
            {loading ? t.buttons.saving : t.buttons.saveAndReview}
          </button>
        )}
      </div>

      {message && (
        <div
          className={`mt-6 rounded-xl border px-5 py-4 text-center text-sm font-black ${
            hasError ? "border-red-200 bg-red-50 text-red-700" : "border-emerald-200 bg-emerald-50 text-emerald-800"
          }`}
        >
          {message}
        </div>
      )}
    </>
  );
}