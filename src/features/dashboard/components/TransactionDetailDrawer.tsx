import { useEffect } from "react";
import {
  CalendarDays,
  CheckCircle2,
  CircleAlert,
  Clock3,
  CreditCard,
  Hash,
  X,
} from "lucide-react";
import type { Transaction } from "../types/api";
import {
  getCategoryColor,
} from "../utils/category";
import {
  getMerchantAvatarStyle,
  getMerchantInitial,
} from "../utils/merchant";

type TransactionDetailDrawerProps = {
  transaction: Transaction | null;
  onClose: () => void;
};

const statusConfig = {
  SUCCESS: {
    label: "Successful",
    icon: CheckCircle2,
    className: "text-emerald-400",
    bgClassName: "bg-emerald-400/10",
  },
  PENDING: {
    label: "Pending",
    icon: Clock3,
    className: "text-amber-400",
    bgClassName: "bg-amber-400/10",
  },
  FAILED: {
    label: "Failed",
    icon: CircleAlert,
    className: "text-red-400",
    bgClassName: "bg-red-400/10",
  },
} as const;

function formatDate(timestamp: string) {
  return new Date(timestamp).toLocaleString("en-IN", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function formatAmount(transaction: Transaction) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: transaction.currency || "INR",
    maximumFractionDigits: 2,
  }).format(transaction.amount);
}

function CategoryDetailIcon({
  category,
}: {
  category: string;
}) {
  const color = getCategoryColor(category);

  const symbols: Record<string, string> = {
    Groceries: "G",
    Education: "E",
    Insurance: "I",
    Shopping: "S",
    Travel: "T",
    Health: "H",
    Fuel: "F",
    Utilities: "U",
    "Food & Dining": "F",
    Entertainment: "E",
  };

  const symbol =
    symbols[category] ??
    (category.trim().charAt(0).toUpperCase() || "?");

  return (
    <span
      className="flex h-5 w-5 items-center justify-center rounded-md text-[10px] font-semibold"
      style={{
        backgroundColor: `${color}1F`,
        color,
      }}
      aria-hidden="true"
    >
      {symbol}
    </span>
  );
}

export function TransactionDetailDrawer({
  transaction,
  onClose,
}: TransactionDetailDrawerProps) {
  useEffect(() => {
    if (!transaction) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [transaction, onClose]);

  if (!transaction) {
    return null;
  }

  const status = statusConfig[transaction.status];
  const StatusIcon = status.icon;

  const avatar = getMerchantAvatarStyle(transaction.merchant);

  return (
    <div
      className="fixed inset-0 z-[100]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="transaction-detail-title"
    >
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close transaction details"
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-black/60 backdrop-blur-[2px]"
      />

      {/* Drawer */}
      <aside className="absolute inset-y-0 right-0 flex w-full max-w-[480px] flex-col border-l border-white/[0.08] bg-[#0D0D0D] shadow-[-20px_0_60px_rgba(0,0,0,0.45)]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/[0.06] px-6 py-5">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-[#77716B]">
              Transaction details
            </p>

            <h2
              id="transaction-detail-title"
              className="mt-1 text-base font-medium text-white"
            >
              Transaction
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.08] text-white/50 transition-colors hover:border-white/[0.16] hover:text-white"
          >
            <X aria-hidden="true" className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {/* Merchant */}
          <div className="flex flex-col items-center text-center">
            <div
              className="flex h-16 w-16 items-center justify-center rounded-2xl text-lg font-semibold"
              style={{
                backgroundColor: avatar.bg,
                color: avatar.text,
              }}
            >
              {getMerchantInitial(transaction.merchant)}
            </div>

            <h3 className="mt-4 text-xl font-semibold tracking-tight text-white">
              {transaction.merchant}
            </h3>

            <p className="mt-1 text-sm text-[#8F8983]">
              {transaction.category}
            </p>

            <p className="mt-5 text-3xl font-semibold tracking-tight text-white">
              {formatAmount(transaction)}
            </p>

            <div
              className={`mt-4 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium ${status.bgClassName} ${status.className}`}
            >
              <StatusIcon aria-hidden="true" className="h-3.5 w-3.5" />
              {status.label}
            </div>
          </div>

          {/* Details */}
          <div className="mt-8 overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.02]">
            <DetailRow
              icon={<Hash className="h-4 w-4" />}
              label="Transaction ID"
              value={transaction.id}
              copyable
            />

            <DetailRow
              icon={<CalendarDays className="h-4 w-4" />}
              label="Date & time"
              value={formatDate(transaction.timestamp)}
            />

            <DetailRow
              icon={<CategoryDetailIcon category={transaction.category} />}
              label="Category"
              value={transaction.category}
            />

            <DetailRow
              icon={<CreditCard className="h-4 w-4" />}
              label="Payment method"
              value={transaction.payment_method}
            />

            <DetailRow
              icon={<span className="text-xs font-semibold">₹</span>}
              label="Currency"
              value={transaction.currency}
            />

            <DetailRow
              icon={<StatusIcon className="h-4 w-4" />}
              label="Status"
              value={status.label}
              valueClassName={status.className}
              last
            />
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-white/[0.06] px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="h-10 w-full rounded-lg border border-white/[0.1] bg-white/[0.03] text-xs font-medium text-white/70 transition-colors hover:border-white/[0.18] hover:bg-white/[0.05] hover:text-white"
          >
            Close
          </button>
        </div>
      </aside>
    </div>
  );
}

type DetailRowProps = {
  icon: React.ReactNode;
  label: string;
  value: string;
  valueClassName?: string;
  copyable?: boolean;
  last?: boolean;
};

function DetailRow({
  icon,
  label,
  value,
  valueClassName = "text-white",
  copyable = false,
  last = false,
}: DetailRowProps) {
  async function copyValue() {
    if (!copyable) return;

    try {
      await navigator.clipboard.writeText(value);
    } catch {
      // Clipboard access can be unavailable in some environments.
    }
  }

  return (
    <div
      className={`flex items-center gap-3 px-4 py-4 ${
        last ? "" : "border-b border-white/[0.05]"
      }`}
    >
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/[0.04] text-white/45">
        {icon}
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-[10px] uppercase tracking-[0.08em] text-[#77716B]">
          {label}
        </p>

        <p
          className={`mt-1 truncate text-xs font-medium ${valueClassName}`}
        >
          {value}
        </p>
      </div>

      {copyable && (
        <button
          type="button"
          onClick={() => void copyValue()}
          className="shrink-0 text-[10px] font-medium text-[#FF6600] hover:text-[#FF7A1A]"
        >
          Copy
        </button>
      )}
    </div>
  );
}
