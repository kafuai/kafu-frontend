interface SignOutButtonProps {
  readonly className?: string;
  readonly label?: string;
}

export default function SignOutButton({
  className,
  label = "تسجيل الخروج",
}: SignOutButtonProps) {
  return (
    <form
      action="/auth/sign-out"
      method="post"
    >
      <button
        type="submit"
        className={
          className ??
          "inline-flex h-10 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 transition hover:border-red-200 hover:bg-red-50 hover:text-red-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-red-100"
        }
      >
        {label}
      </button>
    </form>
  );
}
