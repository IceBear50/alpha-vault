import type { ReactNode } from "react";

export type BalanceCardProps = {
  eyebrow?: string;
  balance: string;
  currency?: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
};

export function BalanceCard({
  eyebrow = "Available balance",
  balance,
  currency = "INR",
  description,
  icon,
  action,
}: BalanceCardProps) {
  return (
    <section className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.035] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.18)] sm:p-7">
      <div
        className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-[#ff6600]/10 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative flex flex-col gap-7">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-white/45">
              {eyebrow}
            </p>

            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-[clamp(32px,4vw,46px)] font-semibold leading-none tracking-[-0.045em] text-white">
                {balance}
              </span>

              <span className="text-xs font-medium uppercase tracking-[0.08em] text-white/35">
                {currency}
              </span>
            </div>
          </div>

          {icon && (
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#ff6600]/20 bg-[#ff6600]/10 text-[#ff6600]">
              {icon}
            </div>
          )}
        </div>

        {(description || action) && (
          <div className="flex flex-col gap-4 border-t border-white/8 pt-5 sm:flex-row sm:items-center sm:justify-between">
            {description && (
              <p className="max-w-[520px] text-sm leading-5 text-white/45">
                {description}
              </p>
            )}

            {action && <div className="shrink-0">{action}</div>}
          </div>
        )}
      </div>
    </section>
  );
}
