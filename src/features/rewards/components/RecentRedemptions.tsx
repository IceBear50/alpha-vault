export type RecentRedemption = {
  id: string | number;
  brand: string;
  title?: string;
  amount?: string;
  cost: string;
  date: string;
  icon?: string;
  status?: "success" | "pending" | "failed";
};

export type RecentRedemptionsProps = {
  redemptions?: RecentRedemption[];
  onViewAll?: () => void;
};

const statusStyles = {
  success: {
    label: "Success",
    className: "bg-emerald-500/10 text-emerald-400",
  },
  pending: {
    label: "Pending",
    className: "bg-amber-500/10 text-amber-400",
  },
  failed: {
    label: "Failed",
    className: "bg-red-500/10 text-red-400",
  },
} as const;

export function RecentRedemptions({ redemptions = [], onViewAll }: RecentRedemptionsProps) {
  return (
    <section className="h-fit overflow-hidden rounded-2xl border border-white/[0.08] bg-[#101010]">
      <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-4">
        <h2 className="text-sm font-semibold text-white">Recent redemptions</h2>

        <button
          type="button"
          onClick={onViewAll}
          disabled={!onViewAll}
          aria-hidden={!onViewAll}
          className="text-xs font-medium text-[#FF6600] transition-colors hover:text-[#FF7A1A]"
        >
          View all
        </button>
      </div>

      {redemptions.length === 0 ? (
        <div className="px-5 py-8 text-center">
          <p className="text-sm text-white/45">No redemption history available.</p>
        </div>
      ) : (
        <div className="divide-y divide-white/[0.06]">
          {redemptions.map((item) => {
            const status = statusStyles[item.status ?? "success"];

            return (
              <article key={item.id} className="flex gap-3 px-5 py-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/[0.08] bg-black text-lg">
                  {item.icon ?? item.brand.charAt(0).toUpperCase()}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-medium text-white">
                    {item.title ?? `${item.brand} Voucher`}
                  </p>

                  {item.amount && <p className="mt-0.5 text-xs text-white/70">{item.amount}</p>}

                  <p className="mt-1 text-[10px] text-white/35">{item.date}</p>
                </div>

                <div className="flex shrink-0 flex-col items-end gap-2">
                  <span className="text-[10px] font-medium text-[#FF6600]">{item.cost}</span>

                  <span
                    className={`rounded-full px-2 py-0.5 text-[9px] font-medium ${status.className}`}
                  >
                    {status.label}
                  </span>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
