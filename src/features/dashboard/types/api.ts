export type TransactionStatus = "SUCCESS" | "FAILED" | "PENDING";

export type PaymentMethod =
  | "Credit Card"
  | "Debit Card"
  | "UPI"
  | "Netbanking"
  | "Wallet";

export type Transaction = {
  id: string;
  timestamp: string;
  merchant: string;
  category: string;
  amount: number;
  currency: string;
  status: TransactionStatus;
  payment_method: PaymentMethod;
};

/**
 * Matches the documented /api/v1/transactions response exactly:
 * { items, total, page, page_count }. There is no `limit` echoed back and
 * no `total_pages` — callers that need the page size already know it (they
 * sent it), and `page_count` is the doc's name for total pages.
 */
export type TransactionsResponse = {
  items: Transaction[];
  total: number;
  page: number;
  page_count: number;
};

export type TransactionQueryParams = {
  page?: number;
  limit?: number;
  category?: string;
  status?: string;
  payment_method?: string;
  search?: string;
  start_date?: string;
  end_date?: string;
  sort_by?: string;
  sort_order?: "asc" | "desc";
};

/**
 * The documented /analytics/spend endpoint only accepts a date range — no
 * search, category, status, or amount filters. Those filters stay
 * table-only; the trend/category charts are date-scoped and, for anything
 * finer, derived client-side from the bulk transaction set (see
 * useFilteredSummary in features/dashboard/utils).
 */
export type SpendAnalyticsQueryParams = {
  start_date?: string;
  end_date?: string;
};

export type CategoryBreakdownEntry = {
  category: string;
  total_amount: number;
  transaction_count?: number;
};

export type MonthlyTrendEntry = {
  month: string;
  total_amount: number;
  transaction_count?: number;
};

export type TopMerchantEntry = {
  merchant: string;
  total_amount: number;
  transaction_count?: number;
};

/**
 * Matches the documented /api/v1/analytics/spend response:
 * { total_spend, category_breakdown, monthly_trends, top_merchants }.
 * The previous total_transactions/successful_transactions/coins_earned
 * fields aren't part of this response — those metric cards now derive
 * from the bulk transaction set instead (see useFilteredSummary in
 * features/dashboard/utils).
 */
export type SpendAnalyticsResponse = {
  total_spend: number;
  category_breakdown: CategoryBreakdownEntry[];
  monthly_trends: MonthlyTrendEntry[];
  top_merchants: TopMerchantEntry[];
};

export type RewardBalanceResponse = {
  balance: number;
};

export type Reward = {
  reward_id: number;
  brand: string;
  description: string;
  coin_cost: number;
};

export type RewardsCatalogResponse = {
  rewards: Reward[];
};

export type RedeemRewardRequest = {
  reward_id: number;
};

export type RedeemRewardResponse = {
  status: string;
  coins_deducted: number;
  remaining_balance: number;
  voucher_code: string;
};
