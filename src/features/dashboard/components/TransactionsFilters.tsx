import { Calendar, Search, X } from "lucide-react";
import type { ChangeEvent } from "react";

export type TransactionsFiltersValue = {
  search: string;
  category: string;
  status: string;
  minAmount: string;
  maxAmount: string;
  startDate: string;
  endDate: string;
};

export type TransactionsFiltersProps = {
  value: TransactionsFiltersValue;
  categories: string[];
  onChange: (next: TransactionsFiltersValue) => void;
  onClearAll: () => void;
};

const STATUS_OPTIONS = [
  { value: "", label: "All statuses" },
  { value: "SUCCESS", label: "Successful" },
  { value: "PENDING", label: "Pending" },
  { value: "FAILED", label: "Failed" },
];

const selectClassName =
  "h-11 min-w-[132px] rounded-xl border border-white/10 bg-[#0D0D0D] px-3 text-sm text-white/80 outline-none transition-colors hover:border-white/15 focus:border-[#FF6600]/40";

const inputClassName =
  "h-11 rounded-xl border border-white/10 bg-[#0D0D0D] px-3 text-sm text-white/80 outline-none placeholder:text-[#6B655F] transition-colors hover:border-white/15 focus:border-[#FF6600]/40";

export function TransactionsFilters({
  value,
  categories,
  onChange,
  onClearAll,
}: TransactionsFiltersProps) {
  function handleField<K extends keyof TransactionsFiltersValue>(key: K) {
    return (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      onChange({ ...value, [key]: event.target.value });
    };
  }

  const hasActiveFilters =
    value.search !== "" ||
    value.category !== "" ||
    value.status !== "" ||
    value.minAmount !== "" ||
    value.maxAmount !== "" ||
    value.startDate !== "" ||
    value.endDate !== "";

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="relative min-w-[200px] flex-1">
        <Search
          aria-hidden="true"
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6B655F]"
        />

        <input
          type="text"
          value={value.search}
          onChange={handleField("search")}
          placeholder="Search merchant..."
          aria-label="Search merchant"
          className={`${inputClassName} w-full pl-9`}
        />
      </div>

      <select
        value={value.category}
        onChange={handleField("category")}
        aria-label="Filter by category"
        className={selectClassName}
      >
        <option value="">All categories</option>
        {categories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>

      <div className="inline-flex h-11 items-center gap-2 rounded-xl border border-white/10 bg-[#0D0D0D] px-3 text-sm text-white/80">
        <Calendar aria-hidden="true" className="h-4 w-4 shrink-0 text-[#6B655F]" />

        <input
          type="date"
          value={value.startDate}
          onChange={handleField("startDate")}
          max={value.endDate || undefined}
          aria-label="From date"
          className="w-[118px] bg-transparent text-sm text-white/80 outline-none [color-scheme:dark]"
        />

        <span className="text-[#6B655F]">–</span>

        <input
          type="date"
          value={value.endDate}
          onChange={handleField("endDate")}
          min={value.startDate || undefined}
          aria-label="To date"
          className="w-[118px] bg-transparent text-sm text-white/80 outline-none [color-scheme:dark]"
        />
      </div>

      <input
        type="number"
        inputMode="decimal"
        value={value.minAmount}
        onChange={handleField("minAmount")}
        placeholder="Min amount"
        aria-label="Minimum amount"
        className={`${inputClassName} w-[120px]`}
      />

      <input
        type="number"
        inputMode="decimal"
        value={value.maxAmount}
        onChange={handleField("maxAmount")}
        placeholder="Max amount"
        aria-label="Maximum amount"
        className={`${inputClassName} w-[120px]`}
      />

      <select
        value={value.status}
        onChange={handleField("status")}
        aria-label="Filter by status"
        className={selectClassName}
      >
        {STATUS_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <button
        type="button"
        onClick={onClearAll}
        disabled={!hasActiveFilters}
        className="inline-flex h-11 items-center gap-1.5 rounded-xl px-3 text-sm font-medium text-[#FF6600] transition-colors hover:bg-[#FF6600]/10 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
      >
        <X aria-hidden="true" className="h-4 w-4" />
        Clear all
      </button>
    </div>
  );
}
