type QuickWin = {
  title: string;
  description: string;
  effort: string;
};

type QuickWinsProps = {
  wins?: QuickWin[];
};

export default function QuickWins({
  wins = [
    {
      title: "تنظيم بيانات الاستكشاف",
      description:
        "تحويل إجابات العميل إلى بنية منظمة يمكن استخدامها لاحقًا في Corporate DNA.",
      effort: "Low",
    },
    {
      title: "تحديد أول 3 عمليات قابلة للأتمتة",
      description:
        "اختيار العمليات المتكررة الأعلى أثرًا لتكون بداية بناء Digital Workforce.",
      effort: "Medium",
    },
    {
      title: "إعداد خريطة قرارات تنفيذية",
      description:
        "ربط المعلومات التشغيلية بالقرارات التي تهم الإدارة العليا بشكل مباشر.",
      effort: "Medium",
    },
  ],
}: QuickWinsProps) {
  return (
    <section className="h-full rounded-[2.5rem] border border-slate-200 bg-white p-8 shadow-sm">
      <div className="border-b border-slate-200 pb-7">
        <p className="text-xs font-black uppercase tracking-[0.3em] text-emerald-600">
          Quick Wins
        </p>

        <h2 className="mt-4 text-3xl font-black leading-tight text-slate-950 md:text-4xl">
          مكاسب سريعة قابلة للتنفيذ
        </h2>

        <p className="mt-4 leading-8 text-slate-600">
          مبادرات منخفضة الجهد وعالية الأثر يمكن البدء بها مباشرة لتحقيق نتائج
          ملموسة خلال فترة قصيرة.
        </p>
      </div>

      <div className="mt-7 grid gap-5 lg:grid-cols-3 xl:grid-cols-1">
        {wins.map((win, index) => (
          <article
            key={win.title}
            className="relative overflow-hidden rounded-[1.75rem] border border-emerald-100 bg-gradient-to-br from-emerald-50 to-white p-6 shadow-sm"
          >
            <div className="absolute right-0 top-0 h-full w-1 bg-gradient-to-b from-emerald-500 to-teal-500" />

            <div className="flex items-center justify-between gap-4">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-emerald-700">
                Quick Win 0{index + 1}
              </p>

              <span className="rounded-full border border-emerald-200 bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.15em] text-emerald-700">
                {win.effort}
              </span>
            </div>

            <h3 className="mt-5 text-xl font-black leading-8 text-slate-950">
              {win.title}
            </h3>

            <p className="mt-4 leading-8 text-slate-700">
              {win.description}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}