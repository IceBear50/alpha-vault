import { useId, useMemo } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export type SpendingDataPoint = {
  label: string;
  amount: number;
};

interface SpendingChartProps {
  data: SpendingDataPoint[];
  title?: string;
  description?: string;
  period: string;
  onPeriodChange: (period: string) => void;
  currency?: string;
  isFetching?: boolean;
  onPointClick?: (label: string) => void;
}

const ANALYTICS_PERIOD_OPTIONS = [
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "yearly", label: "Yearly" },
];

function formatCompactCurrency(value: number, currency: string) {
  const numericValue = Number(value);

  if (!Number.isFinite(numericValue)) {
    return `${currency}0`;
  }

  const absoluteValue = Math.abs(numericValue);

  if (absoluteValue >= 1_000_000) {
    const compact = numericValue / 1_000_000;
    return `${currency}${compact % 1 === 0 ? compact : compact.toFixed(1)}M`;
  }

  if (absoluteValue >= 1_000) {
    const compact = numericValue / 1_000;
    return `${currency}${compact % 1 === 0 ? compact : compact.toFixed(1)}k`;
  }

  return `${currency}${numericValue.toLocaleString("en-IN")}`;
}

function getTickInterval(dataLength: number) {
  if (dataLength <= 7) return 0;
  if (dataLength <= 14) return 1;
  if (dataLength <= 21) return 2;
  if (dataLength <= 31) return 4;
  return Math.ceil(dataLength / 8);
}

function ClickableDot({
  cx,
  cy,
  payload,
  onPointClick,
  visible,
}: {
  cx?: number;
  cy?: number;
  payload?: SpendingDataPoint;
  onPointClick?: (label: string) => void;
  visible: boolean;
}) {
  if (!visible || cx === undefined || cy === undefined) {
    return null;
  }

  return (
    <circle
      cx={cx}
      cy={cy}
      r={4}
      fill="#FF6600"
      stroke="#0D0D0D"
      strokeWidth={2}
      className="cursor-pointer"
      onClick={() => {
        if (payload?.label) {
          onPointClick?.(payload.label);
        }
      }}
    />
  );
}

function PointValueLabel({
  x,
  y,
  value,
  currency,
  index,
  labelStep,
}: {
  x?: string | number;
  y?: string | number;
  value?: unknown;
  currency: string;
  index?: number;
  labelStep: number;
}) {
  if (
    x === undefined ||
    y === undefined ||
    value === undefined ||
    value === null ||
    typeof value === "boolean"
  ) {
    return null;
  }

  if (index !== undefined && index % labelStep !== 0) {
    return null;
  }

  const numericX = typeof x === "string" ? Number.parseFloat(x) : x;
  const numericY = typeof y === "string" ? Number.parseFloat(y) : y;

  const numericValue =
    typeof value === "number"
      ? value
      : typeof value === "string"
        ? Number.parseFloat(value)
        : Number.NaN;

  if (
    !Number.isFinite(numericX) ||
    !Number.isFinite(numericY) ||
    !Number.isFinite(numericValue)
  ) {
    return null;
  }

  return (
    <text
      x={numericX}
      y={Math.max(18, numericY - 12)}
      textAnchor="middle"
      fill="rgba(255,255,255,0.45)"
      fontSize={11}
    >
      {formatCompactCurrency(numericValue, currency)}
    </text>
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
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  );
}

export function SpendingChart({
  data,
  title = "Spending trend",
  description = "Monthly spending over time",
  period,
  onPeriodChange,
  currency = "₹",
  isFetching = false,
  onPointClick,
}: SpendingChartProps) {
  const gradientId = useId().replace(/:/g, "");

  const safeData = useMemo(
    () =>
      data
        .map((item) => ({
          label: String(item.label),
          amount: Number(item.amount),
        }))
        .filter(
          (item) =>
            item.label.length > 0 && Number.isFinite(item.amount),
        ),
    [data],
  );

  const tickInterval = useMemo(
    () => getTickInterval(safeData.length),
    [safeData.length],
  );

  const labelStep = useMemo(() => {
    if (safeData.length <= 7) return 1;
    if (safeData.length <= 14) return 2;
    if (safeData.length <= 21) return 3;
    if (safeData.length <= 31) return 5;
    return Math.ceil(safeData.length / 6);
  }, [safeData.length]);

  const showDots = safeData.length <= 24;

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
            {title}
          </h2>

          <p className="mt-1 text-xs text-[#8F8983]">{description}</p>
        </div>

        <label className="relative shrink-0">
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

      <div className="mt-4 h-72 w-full sm:h-80">
        {safeData.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <p className="text-sm text-[#8F8983]">
              No spending data available.
            </p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={safeData}
              margin={{
                top: 32,
                right: 12,
                bottom: 8,
                left: 4,
              }}
            >
              <defs>
                <linearGradient
                  id={gradientId}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="0%"
                    stopColor="#FF6600"
                    stopOpacity={0.32}
                  />
                  <stop
                    offset="100%"
                    stopColor="#FF6600"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>

              <CartesianGrid
                stroke="rgba(255,255,255,0.06)"
                vertical={false}
              />

              <XAxis
                dataKey="label"
                axisLine={false}
                tickLine={false}
                interval={tickInterval}
                minTickGap={16}
                tick={{
                  fill: "rgba(255,255,255,0.4)",
                  fontSize: 11,
                }}
                dy={8}
              />

              <YAxis
                axisLine={false}
                tickLine={false}
                width={52}
                tick={{
                  fill: "rgba(255,255,255,0.4)",
                  fontSize: 11,
                }}
                tickFormatter={(value: number) =>
                  formatCompactCurrency(value, currency)
                }
              />

              <Tooltip
                cursor={{
                  stroke: "rgba(255,255,255,0.16)",
                  strokeWidth: 1,
                }}
                contentStyle={{
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "10px",
                  background: "#151515",
                  color: "#fff",
                  fontSize: "12px",
                }}
                labelStyle={{
                  color: "rgba(255,255,255,0.5)",
                  marginBottom: "4px",
                }}
                itemStyle={{
                  color: "#FF6600",
                }}
                formatter={(value) => [
                  `${currency}${Number(value).toLocaleString("en-IN")}`,
                  "Spending",
                ]}
              />

              <Area
                type="monotone"
                dataKey="amount"
                stroke="#FF6600"
                strokeWidth={2.5}
                fill={`url(#${gradientId})`}
                connectNulls
                activeDot={{
                  r: 5,
                  fill: "#FF6600",
                  stroke: "#0D0D0D",
                  strokeWidth: 2,
                  cursor: "pointer",
                }}
                dot={(dotProps) => (
                  <ClickableDot
                    key={`dot-${dotProps.payload?.label ?? dotProps.cx}`}
                    {...dotProps}
                    payload={dotProps.payload as SpendingDataPoint | undefined}
                    onPointClick={onPointClick}
                    visible={showDots}
                  />
                )}
                label={(props) => (
                  <PointValueLabel
                    {...props}
                    currency={currency}
                    labelStep={labelStep}
                  />
                )}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </section>
  );
}
