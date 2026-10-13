import type { ButtonHTMLAttributes, ReactNode } from "react";

type HeaderActionProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  icon: ReactNode;
  label: string;
};

export function HeaderAction({
  icon,
  label,
  className = "",
  ...props
}: HeaderActionProps) {
  return (
    <button
      type="button"
      aria-label={label}
      className={`inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-white/60 transition-colors hover:border-white/15 hover:bg-white/[0.06] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff6600] ${className}`}
      {...props}
    >
      {icon}
    </button>
  );
}
