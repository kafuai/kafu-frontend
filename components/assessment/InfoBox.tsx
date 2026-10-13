"use client";

interface InfoBoxProps {
  title: string;
  description: string;
}

export default function InfoBox({ title, description }: InfoBoxProps) {
  return (
    <div className="rounded-2xl bg-slate-100 p-6">
      <h3 className="text-xl font-bold">{title}</h3>
      <p className="mt-3 leading-8 text-slate-600">{description}</p>
    </div>
  );
}