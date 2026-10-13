import type { Transaction } from "../types/api";
import type { SpendingDataPoint } from "../components/SpendingChart";
import type { PeriodOption } from "./period";
import type { TransactionsFiltersValue } from "../components/TransactionsFilters";

/**
 * Client-side filtering that mirrors what the backend applies to
 * /transactions (search/category/status/amount) — used so the charts can
 * react to those filters even though /analytics/spend (per the API doc)
 * only accepts a date range. Date range itself is applied server-side via
 * the bulk fetch params, not here, so it isn't repeated in this pass.
 */
export function applyClientFilters(
  transactions: Transaction[],
  filters: Pick<
    TransactionsFiltersValue,
    "search" | "category" | "status" | "minAmount" | "maxAmount"
  >,
): Transaction[] {
  const search = filters.search.trim().toLowerCase();
  const min = filters.minAmount ? Number(filters.minAmount) : undefined;
  const max = filters.maxAmount ? Number(filters.maxAmount) : undefined;

  return transactions.filter((transaction) => {
    if (search && !transaction.merchant.toLowerCase().includes(search)) {
      return false;
    }

    if (filters.category && transaction.category !== filters.category) {
      return false;
    }

    if (filters.status && transaction.status !== filters.status) {
      return false;
    }

    if (min !== undefined && transaction.amount < min) {
      return false;
    }

    if (max !== undefined && transaction.amount > max) {
      return false;
    }

    return true;
  });
}

function monthKey(timestamp: string): string {
  const date = new Date(timestamp);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function monthLabel(key: string): string {
  const [year, month] = key.split("-").map(Number);
  return new Date(year, month - 1, 1).toLocaleDateString("en-IN", {
    month: "short",
    year: "numeric",
  });
}

/**
 * Builds the spending-trend series directly from filtered transactions,
 * bucketed by month, then rolled up to one point per year for multi-year
 * periods (same reasoning as before: 36-60 monthly points is unreadable as
 * a line).
 */
export function buildTrendFromTransactions(
  transactions: Transaction[],
  granularity: PeriodOption["granularity"],
): SpendingDataPoint[] {
  const byMonth = new Map<string, number>();

  for (const transaction of transactions) {
    if (transaction.status !== "SUCCESS") continue;
    const key = monthKey(transaction.timestamp);
    byMonth.set(key, (byMonth.get(key) ?? 0) + transaction.amount);
  }

  const monthly = Array.from(byMonth.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, amount]) => ({ label: monthLabel(key), key, amount }));

  if (granularity === "month") {
    return monthly.map(({ label, amount }) => ({ label, amount }));
  }

  const byYear = new Map<string, number>();
  for (const { key, amount } of monthly) {
    const year = key.slice(0, 4);
    byYear.set(year, (byYear.get(year) ?? 0) + amount);
  }

  return Array.from(byYear.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([year, amount]) => ({ label: year, amount }));
}

export type CategorySlice = {
  category: string;
  total_amount: number;
};

/** Builds the category donut's data directly from filtered transactions. */
export function buildCategoryBreakdownFromTransactions(
  transactions: Transaction[],
): CategorySlice[] {
  const byCategory = new Map<string, number>();

  for (const transaction of transactions) {
    if (transaction.status !== "SUCCESS") continue;
    byCategory.set(
      transaction.category,
      (byCategory.get(transaction.category) ?? 0) + transaction.amount,
    );
  }

  return Array.from(byCategory.entries())
    .sort(([, a], [, b]) => b - a)
    .map(([category, total_amount]) => ({ category, total_amount }));
}

/**
 * Given a trend point's label (a month like "Mar 2026" or a bare year like
 * "2026"), returns the [start, end] date strings covering that bucket —
 * used so clicking a chart point can narrow the transactions table to
 * exactly that window.
 */
export function getDateRangeForTrendLabel(
  label: string,
): { startDate: string; endDate: string } | null {
  const yearOnly = /^\d{4}$/.exec(label);
  if (yearOnly) {
    const year = Number(label);
    return {
      startDate: new Date(year, 0, 1).toISOString().slice(0, 10),
      endDate: new Date(year, 11, 31).toISOString().slice(0, 10),
    };
  }

  const parsed = new Date(`1 ${label}`);
  if (Number.isNaN(parsed.getTime())) {
    return null;
  }

  const start = new Date(parsed.getFullYear(), parsed.getMonth(), 1);
  const end = new Date(parsed.getFullYear(), parsed.getMonth() + 1, 0);

  return {
    startDate: start.toISOString().slice(0, 10),
    endDate: end.toISOString().slice(0, 10),
  };
}
