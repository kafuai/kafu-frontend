interface PasswordStrengthIndicatorProps {
  password: string;
}

interface PasswordStrength {
  score: number;
  label: string;
  barClassName: string;
  textClassName: string;
}

function evaluatePassword(
  password: string,
): PasswordStrength {
  if (!password) {
    return {
      score: 0,
      label: "أدخل كلمة مرور",
      barClassName: "bg-slate-200",
      textClassName: "text-slate-500",
    };
  }

  let score = 0;

  if (password.length >= 8) {
    score += 1;
  }

  if (password.length >= 12) {
    score += 1;
  }

  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) {
    score += 1;
  }

  if (/\d/.test(password)) {
    score += 1;
  }

  if (/[^A-Za-z0-9]/.test(password)) {
    score += 1;
  }

  if (score <= 1) {
    return {
      score: 1,
      label: "ضعيفة",
      barClassName: "bg-red-500",
      textClassName: "text-red-700",
    };
  }

  if (score <= 3) {
    return {
      score: 2,
      label: "متوسطة",
      barClassName: "bg-amber-500",
      textClassName: "text-amber-700",
    };
  }

  return {
    score: 3,
    label: "قوية",
    barClassName: "bg-emerald-600",
    textClassName: "text-emerald-700",
  };
}

export default function PasswordStrengthIndicator({
  password,
}: PasswordStrengthIndicatorProps) {
  const strength = evaluatePassword(password);

  return (
    <div
      className="mt-3"
      aria-live="polite"
    >
      <div className="grid grid-cols-3 gap-2">
        {[1, 2, 3].map((level) => (
          <div
            key={level}
            className={`h-1.5 rounded-full ${
              strength.score >= level
                ? strength.barClassName
                : "bg-slate-200"
            }`}
          />
        ))}
      </div>

      <div className="mt-2 flex items-center justify-between gap-4 text-xs">
        <p className="text-slate-500">
          استخدم 8 أحرف على الأقل مع أرقام ورموز.
        </p>

        <p className={`shrink-0 font-bold ${strength.textClassName}`}>
          {strength.label}
        </p>
      </div>
    </div>
  );
}
