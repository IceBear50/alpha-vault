export type TransactionStatus = "success" | "pending" | "failed";

export type RecentTransaction = {
  id: string;
  merchant: string;
  category: string;
  amount: string;
  date: string;
  status: TransactionStatus;
  paymentMethod?: string;
};

export type RecentTransactionsProps = {
  transactions: RecentTransaction[];
  title?: string;
  description?: string;
  onViewAll?: () => void;
};

const statusStyles: Record<
  TransactionStatus,
  {
    label: string;
    className: string;
    dotClassName: string;
  }
> = {
  success: {
    label: "Success",
    className: "text-emerald-400",
    dotClassName: "bg-emerald-400",
  },
  pending: {
    label: "Pending",
    className: "text-amber-400",
    dotClassName: "bg-amber-400",
  },
  failed: {
    label: "Failed",
    className: "text-red-400",
    dotClassName: "bg-red-400",
  },
};

function getMerchantInitial(merchant: string) {
  return merchant.trim().charAt(0).toUpperCase();
}

export function RecentTransactions({
  transactions,
  title = "Recent transactions",
  description = "Your latest transactions",
  onViewAll,
}: RecentTransactionsProps) {
  return (
    <section className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0D0D0D]">
      <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-4 sm:px-6">
        <div>
          <h2 className="text-[15px] font-medium tracking-tight text-white">
            {title}
          </h2>

          <p className="mt-1 text-xs text-[#8F8983]">
            {description}
          </p>
        </div>

        {onViewAll && (
          <button
            type="button"
            onClick={onViewAll}
            className="rounded-lg px-3 py-2 text-xs font-medium text-[#FF6600] transition-colors hover:bg-[#FF6600]/10 focus:outline-none focus:ring-2 focus:ring-[#FF6600]/40"
          >
            View all
          </button>
        )}
      </div>

      {transactions.length === 0 ? (
        <div className="flex min-h-40 items-center justify-center px-6 py-10">
          <p className="text-sm text-[#8F8983]">
            No transactions found.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[620px] border-collapse">
            <thead>
              <tr className="border-b border-white/[0.06]">
                <th className="px-5 py-3 text-left text-[10px] font-medium uppercase tracking-[0.08em] text-[#77716B] sm:px-6">
                  Merchant
                </th>

                <th className="px-4 py-3 text-left text-[10px] font-medium uppercase tracking-[0.08em] text-[#77716B]">
                  Category
                </th>

                <th className="px-4 py-3 text-left text-[10px] font-medium uppercase tracking-[0.08em] text-[#77716B]">
                  Date
                </th>

                <th className="px-4 py-3 text-left text-[10px] font-medium uppercase tracking-[0.08em] text-[#77716B]">
                  Status
                </th>

                <th className="px-5 py-3 text-right text-[10px] font-medium uppercase tracking-[0.08em] text-[#77716B] sm:px-6">
                  Amount
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-white/[0.05]">
              {transactions.map((transaction) => {
                const status = statusStyles[transaction.status];

                return (
                  <tr
                    key={transaction.id}
                    className="transition-colors hover:bg-white/[0.02]"
                  >
                    <td className="px-5 py-4 sm:px-6">
                      <div className="flex min-w-0 items-center gap-3">
                        <div
                          aria-hidden="true"
                          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.035] text-xs font-semibold text-white"
                        >
                          {getMerchantInitial(transaction.merchant)}
                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-white">
                            {transaction.merchant}
                          </p>

                          {transaction.paymentMethod && (
                            <p className="mt-0.5 truncate text-[11px] text-[#77716B]">
                              {transaction.paymentMethod}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-4">
                      <span className="text-xs text-[#B8B0A8]">
                        {transaction.category}
                      </span>
                    </td>

                    <td className="whitespace-nowrap px-4 py-4">
                      <span className="text-xs text-[#8F8983]">
                        {transaction.date}
                      </span>
                    </td>

                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 text-xs font-medium ${status.className}`}
                      >
                        <span
                          aria-hidden="true"
                          className={`h-1.5 w-1.5 rounded-full ${status.dotClassName}`}
                        />
                        {status.label}
                      </span>
                    </td>

                    <td className="whitespace-nowrap px-5 py-4 text-right sm:px-6">
                      <span className="text-sm font-medium text-white">
                        {transaction.amount}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
