type ExecutiveChartCardProps = {
  title: string;
  subtitle: string;
  children: React.ReactNode;
};

export default function ExecutiveChartCard({
  title,
  subtitle,
  children,
}: ExecutiveChartCardProps) {
  return (
    <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_18px_60px_rgba(15,23,42,0.08)] transition-all duration-300">
      <div className="border-b border-slate-100 bg-gradient-to-br from-white via-slate-50 to-slate-100/70 px-8 py-7">
        <span className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-black uppercase tracking-[0.28em] text-emerald-700">
          Executive Chart
        </span>

        <h2 className="mt-5 text-2xl font-black tracking-tight text-slate-950 md:text-[1.75rem]">
          {title}
        </h2>

        <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">
          {subtitle}
        </p>
      </div>

      <div className="p-7 md:p-8">
        <div className="rounded-[1.75rem] border border-slate-200 bg-gradient-to-br from-slate-50 via-white to-slate-100/60 p-6 shadow-inner md:p-8">
          {children}
        </div>
      </div>
    </section>
  );
}