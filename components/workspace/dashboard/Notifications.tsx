export default function Notifications() {
  const notifications = [
    {
      title: "طلبات تحتاج مراجعة",
      desc: "يوجد 3 طلبات موظفين بانتظار قرار إداري.",
      level: "عاجل",
      color: "rose",
      time: "منذ 5 دقائق",
    },
    {
      title: "تحديث مؤشر الجاهزية",
      desc: "تم تحديث مؤشر الجاهزية بعد آخر تحليل للبيانات.",
      level: "معلومة",
      color: "sky",
      time: "منذ 20 دقيقة",
    },
    {
      title: "توصية ذكية جديدة",
      desc: "KAFU AI يقترح تحسين مسار الموافقات الداخلية.",
      level: "AI",
      color: "emerald",
      time: "الآن",
    },
  ];

  const colors: Record<string, string> = {
    rose: "bg-rose-500",
    sky: "bg-sky-500",
    emerald: "bg-emerald-500",
  };

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-950">
            التنبيهات
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            آخر التنبيهات المهمة للإدارة التنفيذية.
          </p>
        </div>

        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-600">
          {notifications.length} جديد
        </span>
      </div>

      <div className="mt-6 space-y-4">
        {notifications.map((item) => (
          <div
            key={item.title}
            className="group rounded-3xl border border-slate-200 bg-slate-50 p-5 transition hover:bg-white hover:shadow-md"
          >
            <div className="flex items-start gap-4">
              <div
                className={`mt-2 h-3 w-3 rounded-full ${colors[item.color]}`}
              />

              <div className="flex-1">
                <div className="flex items-center justify-between gap-4">
                  <h3 className="font-black text-slate-950">
                    {item.title}
                  </h3>

                  <span className="text-xs font-bold text-slate-400">
                    {item.time}
                  </span>
                </div>

                <p className="mt-2 text-sm leading-7 text-slate-600">
                  {item.desc}
                </p>

                <div className="mt-4 inline-flex rounded-full bg-white px-3 py-1 text-xs font-black text-slate-600">
                  {item.level}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}