export default function UpcomingTasks() {
  const tasks = [
    { task: "مراجعة تقرير الجاهزية", due: "اليوم", status: "Urgent" },
    { task: "اعتماد توصيات الموارد البشرية", due: "غدًا", status: "Review" },
    { task: "تحديث خطة المخاطر", due: "هذا الأسبوع", status: "Planned" },
  ];

  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-black text-slate-900">المهام القادمة</h2>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
          This Week
        </span>
      </div>

      <div className="mt-6 space-y-3">
        {tasks.map((item) => (
          <div
            key={item.task}
            className="flex items-center justify-between gap-4 rounded-2xl bg-slate-50 p-4"
          >
            <div>
              <p className="font-bold text-slate-900">{item.task}</p>
              <p className="mt-1 text-xs text-slate-500">{item.due}</p>
            </div>

            <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-slate-500">
              {item.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}