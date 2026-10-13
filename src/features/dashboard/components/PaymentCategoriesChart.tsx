import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { getCategoryColor } from "../utils/category";
import { ANALYTICS_PERIOD_OPTIONS } from "../utils/period";

export type CategoryChartEntry = {
  category: string;
  total_amount: number;
};

export type PaymentCategoriesChartProps = {
  categories: CategoryChartEntry[];
  period: string;
  onPeriodChange: (value: string) => void;
  isFetching?: boolean;
  onCategoryClick?: (category: string) => void;
  selectedCategory?: string;
};

function formatCurrency(value: number) {
  return `₹${value.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
}

export function PaymentCategoriesChart({
  categories,
  period,
  onPeriodChange,
  isFetching = false,
  onCategoryClick,
  selectedCategory,
}: PaymentCategoriesChartProps) {
  const activeLabel =
    ANALYTICS_PERIOD_OPTIONS.find((option) => option.value === period)
      ?.label ?? "This month";
  const total = categories.reduce((sum, item) => sum + item.total_amount, 0);

  const data = categories
    .slice()
    .sort((a, b) => b.total_amount - a.total_amount)
    .map((item, index) => ({
      name: item.category,
      value: item.total_amount,
      percentage: total > 0 ? Math.round((item.total_amount / total) * 100) : 0,
      color: getCategoryColor(item.category, index),
    }));

  const activeIndex = data.findIndex((d) => d.name === selectedCategory);

  // Props to highlight the active slice (only when a category is selected)
  const activeProps = selectedCategory
    ? {
        activeIndex,
        activeShape: {
          outerRadius: 98,
          innerRadius: 50,
          stroke: "#FF6600",
          strokeWidth: 2,
          style: { filter: "drop-shadow(0 0 12px rgba(255,102,0,0.5))" },
        },
      }
    : {};

  return (
    <section className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0D0D0D] p-5 sm:p-6">
      {isFetching && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-10 bg-[#0D0D0D]/30 backdrop-blur-[1px]"
        />
      )}

      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-[15px] font-medium tracking-tight text-white">
            Payment categories
          </h2>
          <p className="mt-1 text-xs text-[#8F8983]">
            {activeLabel} • Total {formatCurrency(total)}
          </p>
        </div>

        <label className="relative">
          <span className="sr-only">Select time period</span>
          <select
            value={period}
            onChange={(event) => onPeriodChange(event.target.value)}
            className="appearance-none rounded-lg border border-white/10 bg-white/[0.03] py-1.5 pl-3 pr-8 text-xs font-medium text-white/70 outline-none transition-colors hover:border-white/15 hover:text-white focus:border-[#FF6600]/40"
          >
            {ANALYTICS_PERIOD_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDownIcon className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2" />
        </label>
      </div>

      {data.length === 0 ? (
        <div className="flex flex-1 items-center justify-center py-10">
          <p className="text-sm text-[#8F8983]">No category data yet.</p>
        </div>
      ) : (
        <div className="mt-5 flex flex-1 flex-col items-center gap-6 sm:flex-row sm:items-center">
          <div className="relative h-[190px] w-[190px] shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                
                <Pie
                  data={data}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={58}
                  outerRadius={90}
                  paddingAngle={2}
                  strokeWidth={0}
                  label={({ percent }) => `${Math.round((percent ?? 0) * 100)}%`}
                  labelLine={false}
                  onClick={(entry) => {
                    if (entry.name) {
                      onCategoryClick?.(entry.name);
                    }
                  }}
                  style={{ cursor: onCategoryClick ? "pointer" : "default" }}
                  {...activeProps}
                >
                  {data.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>

                <Tooltip
                  cursor={false}
                  contentStyle={{
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "10px",
                    background: "#151515",
                    color: "#fff",
                    fontSize: "12px",
                  }}
                  formatter={(value, name) => [
                    formatCurrency(Number(value)),
                    String(name),
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <ul className="flex w-full flex-col gap-3">
            {data.map((entry) => (
              <li
                key={entry.name}
                onClick={() => {
                  if (entry.name) {
                    onCategoryClick?.(entry.name);
                  }
                }}
                className={`
                  flex items-center justify-between gap-3 text-sm
                  ${
                    onCategoryClick
                      ? "cursor-pointer rounded-lg px-1.5 py-1 -mx-1.5 transition-colors hover:bg-white/[0.04]"
                      : ""
                  }
                  ${
                    entry.name === selectedCategory
                      ? "bg-white/[0.08] ring-1 ring-[#FF6600]/30"
                      : ""
                  }
                `}
              >
                <span className="flex min-w-0 items-center gap-2">
                  <span
                    aria-hidden="true"
                    className="h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{ backgroundColor: entry.color }}
                  />
                  <span className="truncate text-[#D1C7BD]">{entry.name}</span>
                </span>

                <span className="flex shrink-0 items-baseline gap-2">
                  <span className="font-medium text-white">
                    {formatCurrency(entry.value)}
                  </span>
                  <span className="text-xs text-[#77716B]">
                    ({entry.percentage}%)
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}

function ChevronDownIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={`h-3.5 w-3.5 ${className}`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="m6 9 6 6 6-6" />
    </svg>
  );
}