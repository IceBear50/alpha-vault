export type PeriodOption = {
  value: string;
  label: string;
  months: number;
  /**
   * How the trend chart should bucket points for this range. Short ranges
   * read naturally as one point per month; multi-year ranges are rolled up
   * to one point per year so the chart doesn't render 36-60 cramped points.
   */
  granularity: "month" | "year";
};

/**
 * Shared trailing-window options for the analytics charts. Both the
 * "Payment categories" donut and the "Spending trend" chart read from the
 * same analytics response, so they share one period selector to stay
 * consistent with each other.
 *
 * "This year" and the multi-year ranges request more months than a single
 * `monthly_trend` page might return; the chart aggregates whatever comes
 * back (see aggregateTrend in ./trend), so `months` is a request ceiling
 * rather than a guarantee.
 */
export const ANALYTICS_PERIOD_OPTIONS: PeriodOption[] = [
  { value: "1m", label: "This month", months: 1, granularity: "month" },
  { value: "3m", label: "Last 3 months", months: 3, granularity: "month" },
  { value: "6m", label: "Last 6 months", months: 6, granularity: "month" },
  { value: "12m", label: "Last 12 months", months: 12, granularity: "month" },
  { value: "ytd", label: "This year", months: 12, granularity: "month" },
  { value: "3y", label: "Last 3 years", months: 36, granularity: "year" },
  { value: "5y", label: "Last 5 years", months: 60, granularity: "year" },
];

export const DEFAULT_ANALYTICS_PERIOD = ANALYTICS_PERIOD_OPTIONS[2];

export function getPeriodOption(value: string): PeriodOption {
  return (
    ANALYTICS_PERIOD_OPTIONS.find((option) => option.value === value) ??
    DEFAULT_ANALYTICS_PERIOD
  );
}

/**
 * Converts a period option into an actual start_date for the bulk fetch.
 * "This year" is Jan 1 of the current year; every other option is a
 * trailing window of `months` months back from today. Without this, a
 * trailing option like "6m" or "5y" would fetch the entire transaction
 * history unfiltered, since the bulk fetch only understands date ranges,
 * not month counts.
 */
export function getPeriodDateRange(
  value: string,
  now: Date = new Date(),
): { start_date?: string; end_date?: string } {
  if (value === "ytd") {
    const start = new Date(now.getFullYear(), 0, 1);
    return { start_date: start.toISOString().slice(0, 10) };
  }

  const option = getPeriodOption(value);
  const start = new Date(now.getFullYear(), now.getMonth() - option.months + 1, 1);
  const end = new Date(now);
  return { 
    start_date: start.toISOString().slice(0, 10), 
    end_date: end.toISOString().slice(0, 10) 
  };
}
