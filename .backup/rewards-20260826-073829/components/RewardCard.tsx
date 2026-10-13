import { useEffect, useState } from "react";
import { fetchRewardBalance, fetchRewardCatalog, redeemReward } from "../api";
import type { RewardItem } from "../types";
import { FilterTabs } from "../components/FilterTabs";
import { RecentRedemptions } from "../components/RecentRedemptions";

export function RewardCard({
  reward,
  onRedeem,
  isRedeeming,
}: {
  reward: RewardItem;
  onRedeem: (reward: RewardItem) => void;
  isRedeeming: boolean;
}) {
  const rewardData = reward as RewardItem & {
    name?: string;
    title?: string;
    description?: string;
  };
  const label = rewardData.name || rewardData.title || "Reward";
  const cost = Number(reward.cost_coins) || 0;

  return (
    <div className="p-5 bg-[#111] border border-gray-800 rounded-xl">
      <h3 className="font-semibold">{label}</h3>
      {rewardData.description && <p className="mt-2 text-sm text-gray-400">{rewardData.description}</p>}
      <div className="mt-5 flex items-center justify-between gap-3">
        <span className="text-sm text-gray-400">{cost.toLocaleString()} coins</span>
        <button
          type="button"
          onClick={() => onRedeem(reward)}
          disabled={isRedeeming}
          className="px-3 py-2 rounded-lg bg-white text-black text-sm font-medium disabled:opacity-50"
        >
          {isRedeeming ? "Redeeming…" : "Redeem"}
        </button>
      </div>
    </div>
  );
}

function StatsCards({ balance, isLoading, isError }: { balance: number | null; isLoading: boolean; isError: boolean; }) {
  const safeBalance = Number(balance) || 0;
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="p-5 bg-[#111] border border-gray-800 rounded-xl">
        <p className="text-sm text-gray-400">Coin balance</p>
        <p className="mt-2 text-2xl font-bold">
          {isLoading ? "—" : isError ? "Unavailable" : safeBalance.toLocaleString()}
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
        const rewardsData = Array.isArray(catalogData) ? catalogData : catalogData?.rewards;
        setCatalog(Array.isArray(rewardsData) ? rewardsData : []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load rewards data");
      } finally {
        setIsLoadingBalance(false);
        setIsLoadingCatalog(false);
      }
    };
    loadData();
  }, []);

  const handleRedeem = async (reward: RewardItem) => {
    if (balance === null) return;
    const coinCost = Number(reward.cost_coins) || 0;
    const previousBalance = balance;
    setBalance(prev => (Number(prev) || 0) - coinCost);
    setRedeemingId(reward.id);
    setError(null);
    try {
      await redeemReward(reward.id);
      const [balanceData, catalogData] = await Promise.all([
        fetchRewardBalance(),
        fetchRewardCatalog(),
      ]);
      setBalance(Number(balanceData.coin_balance) || 0);
      const rewardsData = Array.isArray(catalogData) ? catalogData : catalogData?.rewards;
      setCatalog(Array.isArray(rewardsData) ? rewardsData : []);
    } catch (err) {
      setBalance(previousBalance);
      setError(err instanceof Error ? err.message : "Redemption failed. Balance restored.");
    } finally {
      setRedeemingId(null);
    }
  };

  return (
    <div className="p-8 bg-black text-white min-h-screen">
      <div className="mt-6 mb-8">
        <h1 className="text-3xl font-bold">Rewards</h1>
        <p className="text-gray-400 mt-2">Redeem your coins for exciting vouchers, cashback and more.</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg">
          {error}
        </div>
      )}

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-9 flex flex-col gap-6">
          <StatsCards balance={balance} isLoading={isLoadingBalance} isError={!!error} />
          <FilterTabs />
          {isLoadingCatalog ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-64 bg-[#111] border border-gray-800 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              {catalog.map((reward) => (
                <RewardCard key={reward.id} reward={reward} onRedeem={handleRedeem} isRedeeming={redeemingId === reward.id} />
              ))}
            </div>
          )}
        </div>

        <div className="col-span-12 lg:col-span-3">
          <RecentRedemptions />
        </div>
      </div>
    </div>
  );
}

