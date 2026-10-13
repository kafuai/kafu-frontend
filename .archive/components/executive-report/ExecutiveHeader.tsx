type ExecutiveHeaderProps = {
  eyebrow: string;
  title: string;
  description?: string;
  className?: string;
  light?: boolean;
};

export default function ExecutiveHeader({
  eyebrow,
  title,
  description,
  className = "",
  light = false,
}: ExecutiveHeaderProps) {
  return (
    <header className={`mb-10 md:mb-12 ${className}`}>
      <div className="flex items-center gap-4">
        <span
          className={`h-px w-12 rounded-full md:w-16 ${
            light ? "bg-emerald-300/80" : "bg-emerald-500"
          }`}
        />

        <p
          className={`text-[11px] font-black uppercase tracking-[0.34em] ${
            light ? "text-emerald-300" : "text-emerald-600"
          }`}
        >
          {eyebrow}
        </p>
      </div>

      <h2
        className={`mt-5 max-w-5xl text-3xl font-black leading-[1.06] tracking-tight md:mt-6 md:text-4xl xl:text-5xl ${
          light ? "text-white" : "text-slate-950"
        }`}
      >
        {title}
      </h2>

      {description && (
        <p
          className={`mt-5 max-w-4xl text-base leading-8 md:text-lg md:leading-9 ${
            light ? "text-slate-300" : "text-slate-600"
          }`}
        >
          {description}
        </p>
      )}
    </header>
  );
}