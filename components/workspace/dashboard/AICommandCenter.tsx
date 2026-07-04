export default function AICommandCenter() {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
      <div className="absolute left-8 top-8 h-20 w-20 rounded-full bg-emerald-100/70 blur-2xl" />
      <div className="absolute bottom-0 right-0 h-28 w-28 rounded-full bg-slate-100 blur-2xl" />

      <div className="relative grid gap-8 lg:grid-cols-3 lg:items-center">
        <div className="lg:col-span-2">
          <p className="text-sm font-black text-emerald-500">
            AI Command Center
          </p>

          <h2 className="mt-3 text-3xl font-black text-slate-950">
            حالة الذكاء الاصطناعي
          </h2>

          <p className="mt-4 max-w-3xl text-sm leading-8 text-slate-500">
            يقوم KAFU AI بتحليل المؤشرات والتنبيهات والقرارات لتقديم قراءة
            تنفيذية مختصرة وواضحة لصنّاع القرار.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <span className="rounded-full bg-emerald-50 px-4 py-2 text-xs font-bold text-emerald-600">
              Intelligence engine active
            </span>

            <span className="rounded-full bg-slate-100 px-4 py-2 text-xs font-bold text-slate-600">
              Executive insights ready
            </span>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
          <div className="flex items-center justify-between">
            <p className="text-sm font-bold text-slate-500">AI Processing</p>
            <span className="h-3 w-3 rounded-full bg-emerald-400" />
          </div>

          <p className="mt-5 text-5xl font-black text-slate-950">96%</p>

          <div className="mt-5 h-2 rounded-full bg-slate-200">
            <div className="h-2 w-[96%] rounded-full bg-emerald-400" />
          </div>

          <p className="mt-4 text-xs font-bold text-slate-500">
            Real-time executive analysis is running.
          </p>
        </div>
      </div>
    </section>
  );
}