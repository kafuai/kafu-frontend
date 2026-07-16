"use client";

import type {
  ButtonHTMLAttributes,
  ReactNode,
} from "react";

export type ExecutiveButtonVariant =
  | "primary"
  | "secondary"
  | "ghost"
  | "danger";

export type ExecutiveButtonSize =
  | "small"
  | "medium"
  | "large";

export interface ExecutiveButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ExecutiveButtonVariant;
  size?: ExecutiveButtonSize;
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
}

const variantClasses: Record<ExecutiveButtonVariant, string> = {
  primary:
    "border-transparent bg-blue-600 text-white shadow-sm hover:bg-blue-700 active:bg-blue-800 focus-visible:ring-blue-500",
  secondary:
    "border-slate-300 bg-white text-slate-900 shadow-sm hover:bg-slate-50 active:bg-slate-100 focus-visible:ring-blue-500",
  ghost:
    "border-transparent bg-transparent text-slate-700 hover:bg-slate-100 active:bg-slate-200 focus-visible:ring-blue-500",
  danger:
    "border-transparent bg-red-600 text-white shadow-sm hover:bg-red-700 active:bg-red-800 focus-visible:ring-red-500",
};

const sizeClasses: Record<ExecutiveButtonSize, string> = {
  small: "min-h-9 gap-2 rounded-lg px-3 text-sm",
  medium: "min-h-11 gap-2 rounded-xl px-4 text-sm",
  large: "min-h-[52px] gap-2.5 rounded-xl px-6 text-base",
};

export function ExecutiveButton({
  variant = "primary",
  size = "medium",
  loading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  disabled,
  children,
  className = "",
  type = "button",
  ...buttonProps
}: ExecutiveButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      disabled={isDisabled}
      aria-busy={loading}
      className={[
        "inline-flex items-center justify-center border font-semibold",
        "transition-colors duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
        "disabled:cursor-not-allowed disabled:opacity-50",
        variantClasses[variant],
        sizeClasses[size],
        fullWidth ? "w-full" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...buttonProps}
    >
      {loading ? (
        <span
          aria-hidden="true"
          className="h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent"
        />
      ) : (
        leftIcon
      )}

      <span>{children}</span>

      {!loading && rightIcon}
    </button>
  );
}
