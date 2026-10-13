import type { TransactionQueryParams } from "../types/api";

export type SortOption = {
  value: string;
  label: string;
  sortBy: NonNullable<TransactionQueryParams["sort_by"]>;
  sortOrder: NonNullable<TransactionQueryParams["sort_order"]>;
};

export const TRANSACTIONS_SORT_OPTIONS: SortOption[] = [
  { value: "date-desc", label: "Date (Newest)", sortBy: "timestamp", sortOrder: "desc" },
  { value: "date-asc", label: "Date (Oldest)", sortBy: "timestamp", sortOrder: "asc" },
  { value: "amount-desc", label: "Amount (High to low)", sortBy: "amount", sortOrder: "desc" },
  { value: "amount-asc", label: "Amount (Low to high)", sortBy: "amount", sortOrder: "asc" },
];
