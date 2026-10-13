import { useState } from "react";
import { ChevronLeft, ChevronRight, Download } from "lucide-react";
import type { Transaction } from "../types/api";
import { TRANSACTIONS_SORT_OPTIONS } from "../constants/transactions";
import { estimateCoinsEarned, getMerchantAvatarStyle, getMerchantInitial } from "../utils/merchant";
import { getCategoryColor, getCategoryIcon } from "../utils/category";
import { TransactionDetailDrawer } from "./TransactionDetailDrawer";

export type TransactionsTableProps = {
  transactions: Transaction[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  sortValue: string;
  onSortChange: (value: string) => void;
  onPageChange: (page: number) => void;
  onExport?: () => void;
  /** True only while there's no data at all yet (first load for this view). */
  isLoading?: boolean;
  /** True while a background refetch (new page/filter/sort) is in flight. */
  isFetching?: boolean;
  isError?: boolean;
};

const statusStyles: Record<
  Transaction["status"],
  { label: string; className: string; dotClassName: string }
> = {
  SUCCESS: {
    label: "Successful",
    className: "text-emerald-400",
    dotClassName: "bg-emerald-400",
  },
  PENDING: {
    label: "Pending",
    className: "text-amber-400",
    dotClassName: "bg-amber-400",
  },
  FAILED: {
    label: "Failed",
    className: "text-red-400",
    dotClassName: "bg-red-400",
  },
};

function formatDate(timestamp: string) {
  return new Date(timestamp).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function buildPageList(current: number, total: number): (number | "ellipsis")[] {
  if (total <= 5) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages = new Set<number>([1, 2, 3, total]);

  if (current > 1 && current < total) {
    pages.add(current);
  }

  const sorted = Array.from(pages).sort((a, b) => a - b);
  const result: (number | "ellipsis")[] = [];

  sorted.forEach((page, index) => {
    if (index > 0 && page - sorted[index - 1] > 1) {
      result.push("ellipsis");
    }

    result.push(page);
  });

  return result;
}

export function TransactionsTable({
  transactions,
  total,
  page,
  limit,
  totalPages,
  sortValue,
  onSortChange,
  onPageChange,
  onExport,
  isLoading = false,
  isFetching = false,
  isError = false,
}: TransactionsTableProps) {
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  const rangeStart = total === 0 ? 0 : (page - 1) * limit + 1;
  const rangeEnd = Math.min(page * limit, total);
  const pageList = buildPageList(page, Math.max(totalPages, 1));
  const showOverlay = isFetching && !isLoading;

  return (
    <>
      <section className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0D0D0D]">
        {showOverlay && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-10 bg-[#0D0D0D]/40 backdrop-blur-[1px]"
          />
        )}

        {isFetching && (
          <span className="sr-only" role="status">
            Updating transactions…
          </span>
        )}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.06] px-5 py-4 sm:px-6">
          <div>
            <h2 className="text-[15px] font-medium tracking-tight text-white">
              Recent transactions
            </h2>

            <p className="mt-1 text-xs text-[#8F8983]">
              {total > 0
                ? `Showing ${rangeStart}–${rangeEnd} of ${total.toLocaleString("en-IN")}${
                    total >= 10000 ? "+" : ""
                  } transactions`
                : "No transactions found"}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onExport}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] px-3 text-xs font-medium text-white/70 transition-colors hover:border-white/15 hover:text-white"
            >
              <Download aria-hidden="true" className="h-3.5 w-3.5" />
              Export
            </button>

            <label className="sr-only" htmlFor="transactions-sort">
              Sort by
            </label>
            <select
              id="transactions-sort"
              value={sortValue}
              onChange={(event) => onSortChange(event.target.value)}
              className="h-9 rounded-lg border border-white/10 bg-white/[0.03] px-3 text-xs font-medium text-white/70 outline-none transition-colors hover:border-white/15 focus:border-[#FF6600]/40"
            >
              {TRANSACTIONS_SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  Sort by: {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {isLoading ? (
          <div className="flex min-h-40 items-center justify-center px-6 py-10">
            <p className="text-sm text-[#8F8983]">Loading transactions…</p>
          </div>
        ) : isError ? (
          <div className="flex min-h-40 items-center justify-center px-6 py-10">
            <p className="text-sm text-red-400">Unable to load transactions. Please try again.</p>
          </div>
        ) : transactions.length === 0 ? (
          <div className="flex min-h-40 items-center justify-center px-6 py-10">
            <p className="text-sm text-[#8F8983]">No transactions match your filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] border-collapse">
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
                  <th className="px-4 py-3 text-right text-[10px] font-medium uppercase tracking-[0.08em] text-[#77716B]">
                    Amount
                  </th>
                  <th className="px-4 py-3 text-right text-[10px] font-medium uppercase tracking-[0.08em] text-[#77716B]">
                    Coins earned
                  </th>
                  <th className="px-5 py-3 text-right text-[10px] font-medium uppercase tracking-[0.08em] text-[#77716B] sm:px-6">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-white/[0.05]">
                {transactions.map((transaction) => {
                  const status = statusStyles[transaction.status];
                  const avatar = getMerchantAvatarStyle(transaction.merchant);
                  const CategoryIcon = getCategoryIcon(transaction.category);
                  const categoryColor = getCategoryColor(transaction.category);
                  const coins = estimateCoinsEarned(transaction.amount, transaction.status);

                  return (
                    <tr
                      key={transaction.id}
                      onClick={() => setSelectedTransaction(transaction)}
                      className="cursor-pointer transition-colors hover:bg-white/[0.02]"
                      tabIndex={0}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          setSelectedTransaction(transaction);
                        }
                      }}
                    >
                      <td className="px-5 py-4 sm:px-6">
                        <div className="flex min-w-0 items-center gap-3">
                          <div
                            aria-hidden="true"
                            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold"
                            style={{
                              backgroundColor: avatar.bg,
                              color: avatar.text,
                            }}
                          >
                            {getMerchantInitial(transaction.merchant)}
                          </div>

                          <p className="truncate text-sm font-medium text-white">
                            {transaction.merchant}
                          </p>
                        </div>
                      </td>

                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <span
                            aria-hidden="true"
                            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md"
                            style={{
                              backgroundColor: `${categoryColor}1F`,
                              color: categoryColor,
                            }}
                          >
                            <CategoryIcon className="h-3.5 w-3.5" />
                          </span>
                          <span className="whitespace-nowrap text-xs text-[#B8B0A8]">
                            {transaction.category}
                          </span>
                        </div>
                      </td>

                      <td className="whitespace-nowrap px-4 py-4">
                        <span className="text-xs text-[#8F8983]">
                          {formatDate(transaction.timestamp)}
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

                      <td className="whitespace-nowrap px-4 py-4 text-right">
                        <span className="text-sm font-medium text-white">
                          ₹{transaction.amount.toLocaleString("en-IN")}
                        </span>
                      </td>

                      <td className="whitespace-nowrap px-4 py-4 text-right">
                        <span className="text-xs font-medium text-[#FF6600]">
                          {coins !== null ? `+${coins} 🪙` : "—"}
                        </span>
                      </td>

                      <td className="whitespace-nowrap px-5 py-4 text-right sm:px-6">
                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            setSelectedTransaction(transaction);
                          }}
                          className="inline-flex items-center gap-1 text-xs font-medium text-[#FF6600] transition-colors hover:text-[#ff7a1a]"
                        >
                          View
                          <ChevronRight aria-hidden="true" className="h-3 w-3" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.06] px-5 py-4 sm:px-6">
          <p className="text-xs text-[#77716B]">
            {total > 0
              ? `Showing ${rangeStart}–${rangeEnd} of ${total.toLocaleString("en-IN")}${
                  total >= 10000 ? "+" : ""
                } transactions`
              : "No results"}
          </p>

          <nav aria-label="Transactions pagination" className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => onPageChange(page - 1)}
              aria-label="Previous page"
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-white/60 transition-colors hover:border-white/20 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
            >
              <ChevronLeft aria-hidden="true" className="h-4 w-4" />
            </button>

            {pageList.map((item, index) =>
              item === "ellipsis" ? (
                <span key={`ellipsis-${index}`} className="px-1 text-xs text-[#77716B]">
                  …
                </span>
              ) : (
                <button
                  key={item}
                  type="button"
                  onClick={() => onPageChange(item)}
                  aria-current={item === page ? "page" : undefined}
                  className={`inline-flex h-8 min-w-8 items-center justify-center rounded-lg px-2 text-xs font-medium transition-colors ${
                    item === page
                      ? "bg-[#FF6600] text-white"
                      : "text-white/60 hover:bg-white/[0.05] hover:text-white"
                  }`}
                >
                  {item}
                </button>
              ),
            )}

            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() => onPageChange(page + 1)}
              aria-label="Next page"
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-white/60 transition-colors hover:border-white/20 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
            >
              <ChevronRight aria-hidden="true" className="h-4 w-4" />
            </button>
          </nav>
        </div>
      </section>

      <TransactionDetailDrawer
        transaction={selectedTransaction}
        onClose={() => setSelectedTransaction(null)}
      />
    </>
  );
}
