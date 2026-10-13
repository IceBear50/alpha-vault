import { useMemo } from "react";
import type { Transaction } from "../types/api";
import { estimateCoinsEarned } from "./merchant";
import { applyClientFilters } from "./trend";
import type { TransactionsFiltersValue } from "../components/TransactionsFilters";

export type FilteredSummary = {
  filteredTransactions: Transaction[];
  totalSpend: number;
  totalTransactions: number;
  successfulTransactions: number;
  coinsEarned: number;
};

/**
 * Applies the same client-side filters used for the charts (search,
 * category, status, amount — everything /analytics/spend doesn't support)
 * to the bulk transaction set, and derives the summary metrics from the
 * result. This keeps the metric cards, charts, and table all reading from
 * one filtered view instead of drifting out of sync with each other.
 */
export function useFilteredSummary(
  transactions: Transaction[],
  filters: Pick<
    TransactionsFiltersValue,
    "search" | "category" | "status" | "minAmount" | "maxAmount"
  >,
): FilteredSummary {
  return useMemo(() => {
    const filteredTransactions = applyClientFilters(transactions, filters);

    const successful = filteredTransactions.filter(
      (transaction) => transaction.status === "SUCCESS",
    );

    const totalSpend = successful.reduce(
      (sum, transaction) => sum + transaction.amount,
      0,
    );

    const coinsEarned = successful.reduce(
      (sum, transaction) => sum + (estimateCoinsEarned(transaction.amount, transaction.status) ?? 0),
      0,
    );

    return {
      filteredTransactions,
      totalSpend,
      totalTransactions: filteredTransactions.length,
      successfulTransactions: successful.length,
      coinsEarned,
    };
  }, [transactions, filters]);
}
