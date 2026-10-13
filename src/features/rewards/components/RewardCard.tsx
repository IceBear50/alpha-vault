import { useState } from "react";
import type { RewardItem } from "../types";

type RewardCardProps = {
  reward: RewardItem;
  onRedeem: (reward: RewardItem) => Promise<string | null>;
  isRedeeming: boolean;
  disabled?: boolean;
  voucherCode?: string;
};

export function RewardCard({
  reward,
  onRedeem,
  isRedeeming,
  disabled = false,
  voucherCode,
}: RewardCardProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    if (!voucherCode) return;

    try {
      await navigator.clipboard.writeText(voucherCode);
      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <article className="flex flex-col rounded-2xl border border-white/[0.08] bg-[#111] p-5 transition-colors hover:border-white/[0.14]">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.04] text-lg font-semibold text-[#FF6600]">
        {reward.icon_url ? (
          <img
            src={reward.icon_url}
            alt=""
            className="h-8 w-8 object-contain"
          />
        ) : (
          reward.brand.charAt(0).toUpperCase()
        )}
      </div>

      <div className="mt-5 flex-1">
        <h3 className="text-sm font-semibold text-white">
          {reward.title}
        </h3>

        <p className="mt-1 text-xs text-white/40">
          {reward.brand}
        </p>

        <p className="mt-2 line-clamp-3 text-xs leading-5 text-white/45">
          {reward.description}
        </p>
      </div>

      <div className="mt-5 flex items-center justify-between gap-3">
        <div>
          <p className="text-[10px] text-white/35">Cost</p>

          <p className="mt-0.5 text-sm font-semibold text-[#FF6600]">
            {reward.cost_coins.toLocaleString("en-IN")} coins
          </p>
        </div>

        <button
          type="button"
          onClick={() => void onRedeem(reward)}
          disabled={disabled || isRedeeming || Boolean(voucherCode)}
          className="rounded-lg bg-[#FF6600] px-3 py-2 text-xs font-semibold text-black transition-colors hover:bg-[#FF7A1A] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isRedeeming
            ? "Redeeming…"
            : voucherCode
              ? "Redeemed"
              : "Redeem"}
        </button>
      </div>

      {voucherCode && (
        <div className="mt-4 rounded-xl border border-[#FF6600]/20 bg-[#FF6600]/[0.06] p-3">
          <p className="text-[10px] font-medium uppercase tracking-wider text-white/35">
            Your voucher code
          </p>

          <div className="mt-2 flex items-center gap-2">
            <code className="min-w-0 flex-1 truncate rounded-lg border border-white/[0.08] bg-black/30 px-3 py-2 text-xs font-semibold tracking-wider text-[#FF6600]">
              {voucherCode}
            </code>

            <button
              type="button"
              onClick={() => void handleCopy()}
              className="shrink-0 rounded-lg border border-white/[0.08] px-3 py-2 text-xs font-medium text-white/70 transition-colors hover:border-[#FF6600]/30 hover:text-white"
            >
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
        </div>
      )}
    </article>
  );
}
