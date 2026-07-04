import Link from "next/link";
import { Bot, FileText, ShieldAlert, Users } from "lucide-react";

const actions = [
  {
    title: "إنشاء تقرير تنفيذي",
    desc: "توليد ملخص جاهز للإدارة",
    href: "/workspace/executive-report",
    icon: FileText,
  },
  {
    title: "مراجعة طلبات الموظفين",
    desc: "طلبات بانتظار القرار",
    href: "/journey",
    icon: Users,
  },
  {
    title: "تحليل المخاطر",
    desc: "قراءة المخاطر التشغيلية",
    href: "/workspace/dashboard",
    icon: ShieldAlert,
  },
  {
    title: "عرض التوصيات",
    desc: "اقتراحات KAFU AI",
    href: "/modules",
    icon: Bot,
  },
];

export default function QuickActions() {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div>
        <h2 className="text-2xl font-black text-slate-950">إجراءات سريعة</h2>

        <p className="mt-1 text-sm text-slate-500">
          اختصارات تنفيذية للوصول إلى أهم العمليات.
        </p>
      </div>

      <div className="mt-6 grid gap-3">
        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <Link
              key={action.title}
              href={action.href}
              className="group flex items-center justify-between rounded-3xl border border-slate-200 bg-slate-50 p-4 text-right transition hover:-translate-y-1 hover:bg-white hover:shadow-md"
            >
              <div>
                <p className="font-black text-slate-950">{action.title}</p>
                <p className="mt-1 text-xs font-bold text-slate-500">
                  {action.desc}
                </p>
              </div>

              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-slate-700 transition group-hover:bg-slate-950 group-hover:text-white">
                <Icon size={20} />
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}