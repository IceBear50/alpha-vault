import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getTransactions } from "../api/dashboardApi";
import type { TransactionQueryParams } from "../types/api";

export function useTransactions(params?: TransactionQueryParams) {
  return useQuery({
    queryKey: ["dashboard", "transactions", params],
    queryFn: () => getTransactions(params),
    // Keep showing the previous page's rows while the next page/filter/sort
    // is fetching, instead of dropping into a loading state and unmounting
    // the table every time the query key changes.
    placeholderData: keepPreviousData,
  });
}
