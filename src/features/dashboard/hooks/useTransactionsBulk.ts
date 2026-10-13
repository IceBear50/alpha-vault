import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getTransactions } from "../api/dashboardApi";
import type { Transaction } from "../types/api";

const BULK_FETCH_LIMIT = 500;

type BulkTransactionsResponse = {
  items: Transaction[];
  total: number;
};

async function fetchAllTransactions(params: {
  start_date?: string;
  end_date?: string;
}): Promise<BulkTransactionsResponse> {
  const firstPage = await getTransactions({
    ...params,
    page: 1,
    limit: BULK_FETCH_LIMIT,
    sort_by: "timestamp",
    sort_order: "asc",
  });

  const total = firstPage.total;

  if (total <= firstPage.items.length) {
    return {
      items: firstPage.items,
      total,
    };
  }

  const totalPages = Math.ceil(total / BULK_FETCH_LIMIT);

  const remainingPages = await Promise.all(
    Array.from(
      { length: totalPages - 1 },
      (_, index) =>
        getTransactions({
          ...params,
          page: index + 2,
          limit: BULK_FETCH_LIMIT,
          sort_by: "timestamp",
          sort_order: "asc",
        }),
    ),
  );

  return {
    items: [
      ...firstPage.items,
      ...remainingPages.flatMap((page) => page.items),
    ],
    total,
  };
}

/**
 * Fetches the complete transaction dataset for the requested date range.
 *
 * This is intentionally separate from useTransactions(), which remains
 * paginated and is used by the transactions table.
 *
 * The chart receives the complete dataset and performs client-side
 * aggregation into a small number of points.
 */
export function useTransactionsBulk(params: {
  start_date?: string;
  end_date?: string;
}) {
  return useQuery({
    queryKey: ["dashboard", "transactions-bulk", params],

    queryFn: () => fetchAllTransactions(params),

    placeholderData: keepPreviousData,

    staleTime: 60_000,
  });
}
