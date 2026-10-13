import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getSpendAnalytics } from "../api/dashboardApi";
import type { SpendAnalyticsQueryParams } from "../types/api";

export const spendAnalyticsQueryKey = (params?: SpendAnalyticsQueryParams) =>
  ["dashboard", "spend-analytics", params] as const;

/**
 * Backs the top-line "Total spent" metric and any date-range-only view of
 * spend. Per the API doc, /analytics/spend only accepts start_date/end_date
 * — search/category/status/amount filters aren't supported here, so the
 * charts that need to react to those derive from useTransactionsBulk
 * instead (see utils/trend.ts).
 */
export function useSpendAnalytics(params?: SpendAnalyticsQueryParams) {
  return useQuery({
    queryKey: spendAnalyticsQueryKey(params),
    queryFn: () => getSpendAnalytics(params),
    // Keep the current numbers on screen while a new range is loading
    // instead of flashing to empty state.
    placeholderData: keepPreviousData,
  });
}
