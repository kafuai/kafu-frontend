import type { ReactNode } from "react";

type ExecutiveCardProps = {
  children: ReactNode;
  className?: string;
};

export default function ExecutiveCard({
  children,
  className = "",
}: ExecutiveCardProps) {
  return (
    <section
      className={`
        group
        relative
        overflow-hidden
        rounded-[2.25rem]
        border
        border-slate-200/80
        bg-white/95
        p-7
        shadow-[0_22px_70px_rgba(15,23,42,0.075)]
        backdrop-blur-xl
        transition-all
        duration-300
        ease-out
        hover:-translate-y-0.5
        hover:border-slate-300
        hover:shadow-[0_32px_95px_rgba(15,23,42,0.12)]
        md:p-8
        xl:p-9
        ${className}
      `}
    >
      <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-slate-300/90 to-transparent" />

      <div className="pointer-events-none absolute inset-x-8 bottom-0 h-px bg-gradient-to-r from-transparent via-slate-200/80 to-transparent" />

      <div className="pointer-events-none absolute -right-28 -top-28 h-56 w-56 rounded-full bg-slate-100/90 blur-3xl transition-opacity duration-300 group-hover:opacity-95" />

      <div className="pointer-events-none absolute -bottom-32 -left-32 h-60 w-60 rounded-full bg-emerald-50/80 blur-3xl" />

      <div className="relative z-10">{children}</div>
    </section>
  );
}