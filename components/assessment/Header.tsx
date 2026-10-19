"use client";

interface HeaderProps {
  badge: string;
  title: string;
  description: string;
}

export default function Header({ badge, title, description }: HeaderProps) {
  return (
    <section className="rounded-3xl border border-slate-700 bg-slate-900/70 p-10 shadow-xl">
      <p className="font-bold text-emerald-300">{badge}</p>
      <h1 className="mt-4 text-5xl font-black leading-tight">{title}</h1>
      <p className="mt-6 max-w-4xl text-xl leading-9 text-slate-300">{description}</p>
    </section>
  );
}