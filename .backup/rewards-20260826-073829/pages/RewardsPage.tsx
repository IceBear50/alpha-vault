import { useEffect, useState } from "react";
import {
  fetchRewardBalance,
  fetchRewardCatalog,
  redeemReward,
} from "../api";
import type { RewardItem } from "../types";
import { FilterTabs } from "../components/FilterTabs";
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
  const safeBalance = Number(balance) || 0;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div className="rounded-xl border border-gray-800 bg-[#111] p-5">
        <p className="text-sm text-gray-400">Coin balance</p>

        <p className="mt-2 text-2xl font-bold">
          {isLoading
            ? "—"
            : isError
              ? "Unavailable"
              : safeBalance.toLocaleString("en-IN")}
        </p>
      </div>
    </div>
  );
}

export function RewardsPage() {
  const [balance, setBalance] = useState<number | null>(null);
  const [catalog, setCatalog] = useState<RewardItem[]>([]);
  const [isLoadingBalance, setIsLoadingBalance] = useState(true);
  const [isLoadingCatalog, setIsLoadingCatalog] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [redeemingId, setRedeemingId] = useState<number | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [balanceData, catalogData] = await Promise.all([
          fetchRewardBalance(),
          fetchRewardCatalog(),
        ]);

        setBalance(Number(balanceData.coin_balance) || 0);

        setCatalog(catalogData.rewards);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load rewards data",
        );
      } finally {
        setIsLoadingBalance(false);
        setIsLoadingCatalog(false);
      }
    };

    loadData();
  }, []);

  const handleRedeem = async (reward: RewardItem) => {
    if (balance === null) {
      return;
    }

    const coinCost = reward.cost_coins;
    const previousBalance = balance;

    if (coinCost > balance) {
      setError("You do not have enough coins to redeem this reward.");
      return;
    }

    setBalance((previous) => (previous ?? 0) - coinCost);
    setRedeemingId(reward.id);
    setError(null);

    try {
      await redeemReward(reward.id);

      const [balanceData, catalogData] = await Promise.all([
        fetchRewardBalance(),
        fetchRewardCatalog(),
      ]);

      setBalance(balanceData.coin_balance);
      setCatalog(catalogData.rewards);
    } catch (err) {
      setBalance(previousBalance);

      setError(
        err instanceof Error
          ? err.message
          : "Redemption failed. Balance restored.",
      );
    } finally {
      setRedeemingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-black p-8 text-white">
      <div className="mb-8 mt-6">
        <h1 className="text-3xl font-bold">Rewards</h1>

        <p className="mt-2 text-gray-400">
          Redeem your coins for exciting vouchers, cashback and more.
        </p>
      </div>

      {error && (
        <div className="mb-6 rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-red-400">
          {error}
        </div>
      )}

      <div className="flex flex-col gap-6">
        <StatsCards
          balance={balance}
          isLoading={isLoadingBalance}
          isError={Boolean(error)}
        />

        <FilterTabs />

        {isLoadingCatalog ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[...Array(8)].map((_, index) => (
              <div
                key={index}
                className="h-64 animate-pulse rounded-xl border border-gray-800 bg-[#111]"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {catalog.map((reward) => (
              <RewardCard
                key={reward.id}
                reward={reward}
                onRedeem={handleRedeem}
                isRedeeming={redeemingId === reward.id}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}