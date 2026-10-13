import { useEffect, useState } from "react";
import { fetchRewardBalance, fetchRewardCatalog, redeemReward } from "../api";
import type { RewardItem } from "../types";
import { FilterTabs } from "../components/FilterTabs";
import { RecentRedemptions } from "../components/RecentRedemptions";
import { RewardCard } from "../components/RewardCard";

function StatsCards({
  balance,
  isLoading,
  isError,
}: {
  balance: number | null;
  isLoading: boolean;
  isError: boolean;
}) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div className="rounded-2xl border border-white/[0.08] bg-[#111] p-5">
        <p className="text-xs text-white/45">Your coin balance</p>

        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-3xl font-semibold tracking-tight text-white">
            {isLoading ? "—" : isError ? "Unavailable" : (balance ?? 0).toLocaleString("en-IN")}
          </span>

          {!isLoading && !isError && <span className="text-xs text-[#FF6600]">coins</span>}
        </div>

        <p className="mt-3 text-[11px] text-white/30">Redeem your available coins for rewards.</p>
      </div>
    </div>
  );
}

function generateVoucherCode(): string {
  const characters = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

  const segment = () =>
    Array.from({ length: 4 }, () => characters[Math.floor(Math.random() * characters.length)]).join(
      "",
    );

  return `AV-${segment()}-${segment()}`;
}

export function RewardsPage() {
  const [balance, setBalance] = useState<number | null>(null);
  const [catalog, setCatalog] = useState<RewardItem[]>([]);
  const [isLoadingBalance, setIsLoadingBalance] = useState(true);
  const [isLoadingCatalog, setIsLoadingCatalog] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [redeemingId, setRedeemingId] = useState<number | null>(null);
  const [voucherCodes, setVoucherCodes] = useState<Record<number, string>>({});

  useEffect(() => {
    let cancelled = false;

    async function loadRewards() {
      try {
        const [balanceData, catalogData] = await Promise.all([
          fetchRewardBalance(),
          fetchRewardCatalog(),
        ]);

        if (cancelled) return;

        setBalance(balanceData.coin_balance);
        setCatalog(catalogData.rewards);
      } catch (err) {
        if (cancelled) return;

        setError(err instanceof Error ? err.message : "Failed to load rewards data.");
      } finally {
        if (!cancelled) {
          setIsLoadingBalance(false);
          setIsLoadingCatalog(false);
        }
      }
    }

    loadRewards();

    return () => {
      cancelled = true;
    };
  }, []);

  async function handleRedeem(reward: RewardItem): Promise<string | null> {
    if (balance === null || redeemingId !== null) return null;

    if (reward.cost_coins > balance) {
      setError("You do not have enough coins to redeem this reward.");
      return null;
    }

    const previousBalance = balance;

    setError(null);
    setBalance(balance - reward.cost_coins);
    setRedeemingId(reward.id);

    try {
      const response = await redeemReward(reward.id);

      setBalance(response.remaining_balance);

      const voucherCode = response.voucher_code || generateVoucherCode();

      setVoucherCodes((previous) => ({
        ...previous,
        [reward.id]: voucherCode,
      }));

      try {
        const catalogData = await fetchRewardCatalog();
        setCatalog(catalogData.rewards);
      } catch {
        // Redemption is confirmed; catalog refresh can happen on the next load.
      }

      return voucherCode;
    } catch (err) {
      setBalance(previousBalance);

      setError(
        err instanceof Error ? err.message : "Redemption failed. Your balance has been restored.",
      );

      return null;
    } finally {
      setRedeemingId(null);
    }
  }

  return (
    <div className="mx-auto w-full max-w-[1440px]">
      <header className="mb-8">
        <h1 className="text-2xl font-medium tracking-tight text-white sm:text-3xl">Rewards</h1>

        <p className="mt-2 text-sm text-[#D1C7BD]">
          Redeem your coins for exciting vouchers, cashback and more.
        </p>
      </header>

      {error && (
        <div
          role="alert"
          className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400"
        >
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="min-w-0 space-y-6">
          <StatsCards
            balance={balance}
            isLoading={isLoadingBalance}
            isError={Boolean(error) && balance === null}
          />

          <FilterTabs />

          {isLoadingCatalog ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }, (_, index) => (
                <div
                  key={index}
                  className="h-[220px] animate-pulse rounded-2xl border border-white/[0.08] bg-[#111]"
                />
              ))}
            </div>
          ) : catalog.length === 0 ? (
            <div className="rounded-2xl border border-white/[0.08] bg-[#111] px-6 py-12 text-center">
              <p className="text-sm text-white/45">No rewards are currently available.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {catalog.map((reward) => (
                <RewardCard
                  key={reward.id}
                  reward={reward}
                  onRedeem={handleRedeem}
                  isRedeeming={redeemingId === reward.id}
                  voucherCode={voucherCodes[reward.id]}
                  disabled={balance === null || reward.cost_coins > balance}
                />
              ))}
            </div>
          )}
        </div>

        <aside className="min-w-0">
          <RecentRedemptions />
        </aside>
      </div>
    </div>
  );
}
