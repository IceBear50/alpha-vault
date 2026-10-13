import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { DashboardHeader } from "@/features/dashboard/components/DashboardHeader";
import { DashboardMetricCard } from "@/features/dashboard/components/DashboardMetricCard";
import { PaymentCategoriesChart } from "@/features/dashboard/components/PaymentCategoriesChart";
import { RewardsPromoCard } from "@/features/dashboard/components/RewardsPromoCard";
import { SpendingChart } from "@/features/dashboard/components/SpendingChart";
import { TransactionsTable } from "@/features/dashboard/components/TransactionsTable";
import { TRANSACTIONS_SORT_OPTIONS } from "@/features/dashboard/constants/transactions";
import {
  TransactionsFilters,
  type TransactionsFiltersValue,
} from "@/features/dashboard/components/TransactionsFilters";
import { useRewardBalance } from "@/features/dashboard/hooks/useRewardBalance";
import { useRewardsCatalog } from "@/features/dashboard/hooks/useRewardsCatalog";
import { useTransactionsBulk } from "@/features/dashboard/hooks/useTransactionsBulk";
import {
  DEFAULT_ANALYTICS_PERIOD,
  getPeriodDateRange,
  getPeriodOption,
} from "@/features/dashboard/utils/period";
import {
  applyClientFilters,
  buildCategoryBreakdownFromTransactions,
  buildTrendFromTransactions,
  getDateRangeForTrendLabel,
} from "@/features/dashboard/utils/trend";
import { useFilteredSummary } from "@/features/dashboard/utils/useFilteredSummary";

const PAGE_SIZE = 10;

const EMPTY_FILTERS: TransactionsFiltersValue = {
  search: "",
  category: "",
  status: "",
  minAmount: "",
  maxAmount: "",
  startDate: "",
  endDate: "",
};

/**
 * The whole dashboard is driven by one bulk transaction fetch per date
 * range (useTransactionsBulk) — search/category/status/amount filters,
 * sorting, and pagination are all applied in-memory from that set. This is
 * what makes the charts, metric cards, and table all react together to
 * search/filter changes and to clicking a chart point/slice: they all read
 * from the same filtered+sorted array, just sliced differently.
 */
export function DashboardPage() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<TransactionsFiltersValue>(EMPTY_FILTERS);
  const [page, setPage] = useState(1);
  const [sortValue, setSortValue] = useState(TRANSACTIONS_SORT_OPTIONS[0].value);
  const [period, setPeriod] = useState(DEFAULT_ANALYTICS_PERIOD.value);

  const sortOption =
    TRANSACTIONS_SORT_OPTIONS.find((option) => option.value === sortValue) ??
    TRANSACTIONS_SORT_OPTIONS[0];

  const periodOption = getPeriodOption(period);
  // Determine the effective date range for the API call.
  // If the user has manually set a start or end date, use those instead of the period selector.
  const effectiveDateRange = useMemo(() => {
    if (filters.startDate || filters.endDate) {
      return {
        start_date: filters.startDate || undefined,
        end_date: filters.endDate || undefined,
      };
    }
    return getPeriodDateRange(period);
  }, [filters.startDate, filters.endDate, period]);

  // Debounce the search text so the *derived* views don't thrash on every
  // keystroke's intermediate value. This no longer gates a network request
  // (there isn't one per keystroke) — it just smooths the recompute.
  const debouncedSearch = useDebouncedValue(filters.search, 150);

  // One bulk fetch per date range (period selector), cached by React Query.
  // Search/category/status/amount/sort/page never trigger a new request —
  // they're all applied client-side below — which is what keeps typing and
  // chart clicks instant even with a large transaction volume.
  const {
    data: bulkData,
    isLoading: isBulkLoading,
    isFetching: isBulkFetching,
    isError: isBulkError,
  } = useTransactionsBulk(effectiveDateRange);

  const bulkTransactions = useMemo(() => bulkData?.items ?? [], [bulkData]);

  const effectiveFilters = useMemo(
    () => ({ ...filters, search: debouncedSearch }),
    [filters, debouncedSearch],
  );

  // The single source of truth for "what matches the current filters" —
  // charts, metric cards, and the table all read from this one filtered
  // view instead of drifting out of sync with each other.
  const summary = useFilteredSummary(bulkTransactions, effectiveFilters);

  const sortedTransactions = useMemo(() => {
    const sorted = [...summary.filteredTransactions];

    sorted.sort((a, b) => {
      const direction = sortOption.sortOrder === "asc" ? 1 : -1;

      if (sortOption.sortBy === "amount") {
        return (a.amount - b.amount) * direction;
      }

      return (new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()) * direction;
    });

    return sorted;
  }, [summary.filteredTransactions, sortOption]);

  const totalTransactions = sortedTransactions.length;
  const totalPages = Math.max(1, Math.ceil(totalTransactions / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pagedTransactions = useMemo(
    () => sortedTransactions.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE),
    [sortedTransactions, safePage],
  );

  const {
    data: rewardBalance,
    isLoading: isRewardBalanceLoading,
    isError: isRewardBalanceError,
  } = useRewardBalance();

  const { data: rewardsCatalog, isError: isRewardsCatalogError } = useRewardsCatalog();

  const spendingData = useMemo(
    () => buildTrendFromTransactions(summary.filteredTransactions, periodOption.granularity),
    [summary.filteredTransactions, periodOption.granularity],
  );

  // Category options for the filter dropdown come from the full bulk set
  // (not the filtered one) so picking a category never removes other
  // categories from the list.
  const categoryOptions = useMemo(
    () => Array.from(new Set(bulkTransactions.map((t) => t.category))).sort(),
    [bulkTransactions],
  );

  const chartFilters = useMemo(() => ({ ...effectiveFilters, category: "" }), [effectiveFilters]);

  const chartFilteredTransactions = useMemo(
    () => applyClientFilters(bulkTransactions, chartFilters),
    [bulkTransactions, chartFilters],
  );

  const chartCategoryBreakdown = useMemo(
    () => buildCategoryBreakdownFromTransactions(chartFilteredTransactions),
    [chartFilteredTransactions],
  );

  function handleFiltersChange(next: TransactionsFiltersValue) {
    setFilters(next);
    setPage(1);
  }

  function handleClearFilters() {
    setFilters(EMPTY_FILTERS);
    setPage(1);
  }

  function handleSortChange(value: string) {
    setSortValue(value);
    setPage(1);
  }

  // Clicking a trend point narrows every derived view (table, metrics,
  // donut) to that month/year's date range.
  function handleTrendPointClick(label: string) {
    const range = getDateRangeForTrendLabel(label);
    if (!range) return;

    setFilters((prev) => ({
      ...prev,
      startDate: range.startDate,
      endDate: range.endDate,
    }));
    setPage(1);
  }

  // Clicking a category slice/legend row narrows the table to that
  // category — clicking the already-selected category clears it again.
  function handleCategoryClick(category: string) {
    setFilters((prev) => ({
      ...prev,
      category: prev.category === category ? "" : category,
    }));
    setPage(1);
  }

  // Only the bulk fetch (which everything derives from) and reward balance
  // gate the whole page. There's no separate transactions request anymore,
  // so there's no second loading/error state to reconcile against this one.
  if (isBulkLoading || isRewardBalanceLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-sm text-white/60">Loading dashboard...</p>
      </div>
    );
  }

  if (isBulkError || isRewardBalanceError || isRewardsCatalogError) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-sm text-red-400">Unable to load dashboard data.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[1440px] space-y-6">
      <DashboardHeader
        userName="John"
        coinBalance={rewardBalance?.balance ?? 0}
        notificationCount={3}
      />

      <section
        aria-label="Financial overview"
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        <DashboardMetricCard
          title="Total spent"
          value={`₹${summary.totalSpend.toLocaleString("en-IN", {
            maximumFractionDigits: 0,
          })}`}
          icon="spent"
        />

        <DashboardMetricCard
          title="Successful payments"
          value={summary.successfulTransactions.toLocaleString("en-IN")}
          icon="payments"
        />

        <DashboardMetricCard
          title="Coins earned"
          value={summary.coinsEarned.toLocaleString("en-IN")}
          icon="coins"
        />

        <DashboardMetricCard
          title="Average payment"
          value={
            summary.successfulTransactions > 0
              ? `₹${Math.round(summary.totalSpend / summary.successfulTransactions).toLocaleString(
                  "en-IN",
                )}`
              : "₹0"
          }
          icon="average"
        />
      </section>

      <section
        aria-label="Spending breakdown"
        className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]"
      >
        <PaymentCategoriesChart
          categories={chartCategoryBreakdown}
          period={period}
          onPeriodChange={setPeriod}
          isFetching={isBulkFetching}
          onCategoryClick={handleCategoryClick}
          selectedCategory={filters.category}
        />
        <SpendingChart
          data={spendingData}
          period={period}
          onPeriodChange={setPeriod}
          isFetching={isBulkFetching}
          onPointClick={handleTrendPointClick}
        />
      </section>

      <TransactionsFilters
        value={filters}
        categories={categoryOptions}
        onChange={handleFiltersChange}
        onClearAll={handleClearFilters}
      />

      <section
        aria-label="Transactions and rewards"
        className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_320px]"
      >
        <TransactionsTable
          transactions={pagedTransactions}
          total={totalTransactions}
          page={safePage}
          limit={PAGE_SIZE}
          totalPages={totalPages}
          sortValue={sortValue}
          onSortChange={handleSortChange}
          onPageChange={setPage}
          isLoading={isBulkLoading}
          isFetching={isBulkFetching}
          isError={isBulkError}
        />

        {isRewardsCatalogError ? (
          <section className="flex h-full min-h-48 items-center justify-center rounded-2xl border border-white/[0.08] bg-[#101010] p-6 text-center">
            <p className="text-sm text-red-400">Unable to load rewards.</p>
          </section>
        ) : (
          <RewardsPromoCard
            rewards={rewardsCatalog?.rewards ?? []}
            onExploreRewards={() => navigate("/rewards")}
          />
        )}
      </section>
    </div>
  );
}
