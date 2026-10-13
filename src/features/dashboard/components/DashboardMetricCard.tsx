type DashboardMetricCardProps = {
  title: string;
  value: string;
  trend?: string;
  trendLabel?: string;
  icon: "spent" | "payments" | "coins" | "average";
};

const icons = {
  spent: (
    <svg
      aria-hidden="true"
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M17 8V6a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-2m0-6h2a2 2 0 012 2v6a2 2 0 01-2 2h-2V8zm-3 5h.01"
      />
    </svg>
  ),
  payments: (
    <svg
      aria-hidden="true"
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path strokeLinecap="round" d="M3 10h18M7 15h3" />
    </svg>
  ),
  coins: (
    <svg
      aria-hidden="true"
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <ellipse cx="12" cy="7" rx="7" ry="3" />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5 7v5c0 1.657 3.134 3 7 3s7-1.343 7-3V7M5 12v5c0 1.657 3.134 3 7 3s7-1.343 7-3v-5"
      />
    </svg>
  ),
  average: (
    <svg
      aria-hidden="true"
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 19V5m0 14h16M7 15l4-4 3 3 5-7"
      />
    </svg>
  ),
};

export function DashboardMetricCard({
  title,
  value,
  trend,
  trendLabel = "vs last month",
  icon,
}: DashboardMetricCardProps) {
  return (
    <article className="min-w-0 rounded-xl border border-white/[0.09] bg-[#0F1010] px-4 py-4 shadow-[0_8px_30px_rgba(0,0,0,0.2)]">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#FF6600]/20 bg-[#FF6600]/[0.08] text-[#FF6600]">
          {icons[icon]}
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium text-[#D1C7BD]">
            {title}
          </p>

          <p className="mt-1 text-[21px] font-medium tracking-tight text-white">
            {value}
          </p>

          {trend && (
            <div className="mt-2 flex items-center gap-2 text-xs">
              <span className="font-medium text-[#FF6600]">
                ↑ {trend}
              </span>

              <span className="text-[#8D8781]">
                {trendLabel}
              </span>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
