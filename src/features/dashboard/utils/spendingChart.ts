import type { Transaction } from "../types/api";

export type SpendingChartPeriod = "weekly" | "monthly" | "yearly";

export type SpendingChartPoint = {
  label: string;
  amount: number;
  date: string;
};

function getDate(timestamp: string) {
  const date = new Date(timestamp);

  return Number.isNaN(date.getTime()) ? null : date;
}

function startOfDay(date: Date) {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
}

function formatDay(date: Date) {
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
  });
}

function formatMonth(date: Date) {
  return date.toLocaleDateString("en-IN", {
    month: "short",
  });
}


function formatMonthKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function aggregateByDay(
  transactions: Transaction[],
  startDate: Date,
  endDate: Date,
): SpendingChartPoint[] {
  const totals = new Map<string, number>();

  const cursor = startOfDay(startDate);
  const end = startOfDay(endDate);

  while (cursor <= end) {
    totals.set(cursor.toISOString().slice(0, 10), 0);
    cursor.setDate(cursor.getDate() + 1);
  }

  for (const transaction of transactions) {
    if (transaction.status !== "SUCCESS") continue;

    const date = getDate(transaction.timestamp);
    if (!date) continue;

    const day = startOfDay(date);

    if (day < startDate || day > endDate) continue;

    const key = day.toISOString().slice(0, 10);

    totals.set(key, (totals.get(key) ?? 0) + Number(transaction.amount || 0));
  }

  return Array.from(totals.entries()).map(([key, amount]) => {
    const date = new Date(`${key}T00:00:00`);

    return {
      date: key,
      label: formatDay(date),
      amount,
    };
  });
}

function aggregateByMonth(transactions: Transaction[]): SpendingChartPoint[] {
  const totals = new Map<string, number>();

  for (const transaction of transactions) {
    if (transaction.status !== "SUCCESS") continue;

    const date = getDate(transaction.timestamp);
    if (!date) continue;

    const key = formatMonthKey(date);

    totals.set(key, (totals.get(key) ?? 0) + Number(transaction.amount || 0));
  }

  return Array.from(totals.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, amount]) => {
      const [year, month] = key.split("-").map(Number);
      const date = new Date(year, month - 1, 1);

      return {
        date: key,
        label: `${formatMonth(date)} ${year}`,
        amount,
      };
    });
}

function getDateRange(
  transactions: Transaction[],
  period: SpendingChartPeriod,
) {
  const dates = transactions
    .map((transaction) => getDate(transaction.timestamp))
    .filter((date): date is Date => date !== null)
    .sort((a, b) => a.getTime() - b.getTime());

  if (dates.length === 0) {
    return null;
  }

  const latest = startOfDay(dates[dates.length - 1]);

  if (period === "weekly") {
    const start = new Date(latest);
    start.setDate(start.getDate() - 6);

    return {
      start,
      end: latest,
    };
  }

  if (period === "monthly") {
    const start = new Date(
      latest.getFullYear(),
      latest.getMonth(),
      1,
    );

    const end = new Date(
      latest.getFullYear(),
      latest.getMonth() + 1,
      0,
    );

    return {
      start,
      end,
    };
  }

  return null;
}

export function buildSpendingChartData(
  transactions: Transaction[],
  period: SpendingChartPeriod,
): SpendingChartPoint[] {
  if (transactions.length === 0) {
    return [];
  }

  if (period === "yearly") {
    return aggregateByMonth(transactions);
  }

  const range = getDateRange(transactions, period);

  if (!range) {
    return [];
  }

  return aggregateByDay(
    transactions,
    range.start,
    range.end,
  );
}
