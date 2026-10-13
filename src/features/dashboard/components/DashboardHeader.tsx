type DashboardHeaderProps = {
  userName: string;
  greeting?: string;
  subtitle?: string;
  coinBalance: number;
  notificationCount?: number;
  onNotificationsClick?: () => void;
};

function formatCoinBalance(value: number) {
  return new Intl.NumberFormat("en-IN").format(value);
}

export function DashboardHeader({
  userName,
  greeting = "Good evening",
  subtitle = "Here’s what happened with your money today.",
  coinBalance,
  notificationCount = 0,
  onNotificationsClick,
}: DashboardHeaderProps) {
  return (
    <header className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0">
        <h1 className="text-xl font-medium tracking-tight text-white sm:text-2xl lg:text-[25px]">
          {greeting}, {userName}{" "}
          <span aria-hidden="true" className="inline-block">
            👋
          </span>
        </h1>

        <p className="mt-1 text-sm text-[#D1C7BD]">
          {subtitle}
        </p>
      </div>

      <div className="flex items-center gap-3 self-end sm:self-auto">
        <div className="flex min-w-[205px] items-center gap-3 rounded-xl border border-white/[0.08] bg-[#11100F] px-4 py-3 shadow-[0_8px_30px_rgba(0,0,0,0.25)]">
          <div
            aria-hidden="true"
            className="flex h-9 w-9 shrink-0 items-center justify-center text-[22px]"
          >
            🪙
          </div>

          <div className="min-w-0">
            <p className="text-[11px] leading-4 text-[#D1C7BD]">
              Reward coin balance
            </p>

            <div className="mt-0.5 flex items-baseline gap-2">
              <span className="text-[23px] font-medium leading-7 tracking-tight text-white">
                {formatCoinBalance(coinBalance)}
              </span>

              <span className="text-xs font-medium text-[#FF6600]">
                coins
              </span>
            </div>
          </div>
        </div>

        <button
          type="button"
          aria-label={
            notificationCount > 0
              ? `${notificationCount} unread notifications`
              : "Notifications"
          }
          onClick={onNotificationsClick}
          className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/[0.08] bg-[#0D0D0D] text-[#D1C7BD] transition-colors hover:border-[#FF6600]/40 hover:text-white focus:outline-none focus:ring-2 focus:ring-[#FF6600]/50"
        >
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
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>

          {notificationCount > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full border-2 border-[#080808] bg-[#FF6600] px-1 text-[10px] font-semibold leading-none text-black">
              {notificationCount > 99 ? "99+" : notificationCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}
