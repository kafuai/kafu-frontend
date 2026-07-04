export default function RecentActivity() {
  const activities = [
    {
      title: "تم إنشاء تقرير أولي",
      time: "قبل 12 دقيقة",
      desc: "تم تحليل بيانات الشركة وإنتاج ملخص تنفيذي أولي.",
    },
    {
      title: "مراجعة بيانات الموارد البشرية",
      time: "قبل 28 دقيقة",
      desc: "تم فحص إجابات الشركة المتعلقة بالموظفين والهيكل الإداري.",
    },
    {
      title: "توصية جديدة",
      time: "قبل ساعة",
      desc: "تم تسجيل توصية لتحسين سرعة الموافقات الداخلية.",
    },
  ];

  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-black text-slate-900">آخر النشاطات</h2>

      <div className="mt-6 space-y-4">
        {activities.map((activity) => (
          <div key={activity.title} className="flex gap-4 rounded-2xl bg-slate-50 p-4">
            <span className="mt-2 h-3 w-3 rounded-full bg-slate-950" />

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-bold text-slate-900">{activity.title}</p>
                <span className="text-xs text-slate-400">{activity.time}</span>
              </div>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                {activity.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}