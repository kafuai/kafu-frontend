export default function ExecutiveBrief() {
  return (
    <section className="relative overflow-hidden rounded-[2rem] bg-slate-950 p-8 text-white shadow-xl">
      <div className="absolute -left-16 -top-16 h-56 w-56 rounded-full bg-white/10" />
      <div className="absolute bottom-0 right-0 h-40 w-40 rounded-full bg-white/5" />

      <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-300">
            الملخص التنفيذي
          </p>

          <h2 className="mt-4 max-w-3xl text-3xl font-black leading-tight md:text-4xl">
            شركتك تتحرك باتجاه جاهزية أعلى
          </h2>

          <p className="mt-4 max-w-4xl text-sm leading-7 text-slate-300 md:text-base">
            بناءً على البيانات الأولية، تظهر مؤشرات إيجابية في الجاهزية
            التشغيلية وتجربة الموظف، مع وجود فرص واضحة لتحسين سرعة الموافقات
            وتقليل المخاطر التشغيلية.
          </p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur">
          <p className="text-sm text-slate-300">Company Readiness</p>
          <p className="mt-2 text-4xl font-black">82%</p>
        </div>
      </div>
    </section>
  );
}