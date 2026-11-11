// PageHeader.tsx
import { MessageSquareText, Paperclip, ShieldCheck, Sparkles } from "lucide-react";

type PageHeaderProps = {
  t: any;
  completedAnswers: number;
  totalAttachments: number;
};

export default function PageHeader({ t, completedAnswers, totalAttachments }: PageHeaderProps) {
  return (
    <section className="relative overflow-hidden border-b border-slate-800 bg-slate-950">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.16),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.12),transparent_38%)]" />

      <div className="relative mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-14 lg:px-10">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-xs font-black text-emerald-300">
              <Sparkles size={15} />
              {t.header.badge}
            </div>
            <h1 className="mt-5 text-3xl font-black leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
              {t.header.title}
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-8 text-slate-300 sm:text-lg">
              {t.header.description}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 lg:w-[420px]">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center backdrop-blur">
              <MessageSquareText size={18} className="mx-auto text-emerald-300" />
              <p className="mt-2 text-2xl font-black text-white">{completedAnswers}</p>
              <p className="mt-1 text-[11px] font-bold text-slate-400">{t.stats.answers}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center backdrop-blur">
              <Paperclip size={18} className="mx-auto text-blue-300" />
              <p className="mt-2 text-2xl font-black text-white">{totalAttachments}</p>
              <p className="mt-1 text-[11px] font-bold text-slate-400">{t.stats.attachments}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center backdrop-blur">
              <ShieldCheck size={18} className="mx-auto text-violet-300" />
              <p className="mt-2 text-2xl font-black text-white">{t.stats.secure}</p>
              <p className="mt-1 text-[11px] font-bold text-slate-400">{t.stats.context}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}