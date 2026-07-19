import Link from "next/link";
import {
  Bot,
  ChevronLeft,
  FileText,
  ShieldAlert,
  Users,
} from "lucide-react";

const actions = [
  {
    title: "إنشاء تقرير تنفيذي",
    description: "توليد ملخص جاهز للإدارة",
    href: "/workspace/executive-report",
    icon: FileText,
  },
  {
    title: "مراجعة طلبات الموظفين",
    description: "طلبات بانتظار القرار",
    href: "/journey",
    icon: Users,
  },
  {
    title: "تحليل المخاطر",
    description: "قراءة المخاطر التشغيلية",
    href: "/workspace/dashboard",
    icon: ShieldAlert,
  },
  {
    title: "عرض التوصيات",
    description: "اقتراحات KAFU AI",
    href: "/modules",
    icon: Bot,
  },
];

export default function QuickActions() {
  return (
    <section
      dir="rtl"
      className="rounded-3xl border border-slate-200 bg-white p-5 text-right shadow-sm"
    >
      <h2 className="text-xl font-black text-slate-950">
        إجراءات سريعة
      </h2>

      <p className="mt-1 text-sm leading-6 text-slate-500">
        وصول مباشر إلى أهم العمليات التنفيذية.
      </p>

      <div className="mt-4 grid gap-2">
        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <Link
              key={action.title}
              href={action.href}
              className="group flex min-h-[62px] items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 transition hover:border-blue-200 hover:bg-blue-50/60"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-slate-600 shadow-sm transition group-hover:bg-blue-600 group-hover:text-white">
                <Icon size={17} />
              </span>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-black text-slate-950">
                  {action.title}
                </p>

                <p className="mt-0.5 truncate text-[11px] font-bold text-slate-500">
                  {action.description}
                </p>
              </div>

              <ChevronLeft
                size={16}
                className="shrink-0 text-slate-400 transition group-hover:-translate-x-0.5 group-hover:text-blue-600"
              />
            </Link>
          );
        })}
      </div>
    </section>
  );
}