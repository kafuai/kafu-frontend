type ExecutiveScoreRingProps = {
  score: number;
  label: string;
};

export default function ExecutiveScoreRing({
  score,
  label,
}: ExecutiveScoreRingProps) {
  const radius = 72;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.min(Math.max(score, 0), 100) / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative flex h-[210px] w-[210px] items-center justify-center">
        <svg
          width="210"
          height="210"
          viewBox="0 0 210 210"
          className="-rotate-90"
        >
          <defs>
            <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10B981" />
              <stop offset="55%" stopColor="#0EA5E9" />
              <stop offset="100%" stopColor="#4F46E5" />
            </linearGradient>
          </defs>

          <circle
            cx="105"
            cy="105"
            r={radius}
            fill="none"
            stroke="#E2E8F0"
            strokeWidth="14"
          />

          <circle
            cx="105"
            cy="105"
            r={radius}
            fill="none"
            stroke="url(#scoreGradient)"
            strokeWidth="14"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-700 ease-out"
          />
        </svg>

        <div className="absolute flex h-32 w-32 flex-col items-center justify-center rounded-full border border-slate-200 bg-white shadow-[0_12px_40px_rgba(15,23,42,0.10)]">
          <span className="text-5xl font-black tracking-tight text-slate-900">
            {score}
            <span className="text-2xl text-slate-500">%</span>
          </span>

          <span className="mt-2 text-xs font-bold uppercase tracking-[0.24em] text-slate-500">
            {label}
          </span>
        </div>
      </div>
    </div>
  );
}