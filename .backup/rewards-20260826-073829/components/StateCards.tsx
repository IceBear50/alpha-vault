interface StatsCardsProps {
  balance: number | null;
  isLoading: boolean;
  isError: boolean;
}

export function StatsCards({ balance, isLoading, isError }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {/* Balance Card */}
      <div className="bg-[#111] p-6 rounded-xl border border-gray-800">
        <p className="text-sm text-gray-400">Your coin balance</p>
        {isLoading ? (
          <div className="h-8 w-32 bg-gray-800 animate-pulse rounded mt-2" />
        ) : isError ? (
          <p className="text-red-500 mt-2 text-lg font-bold">Error loading</p>
        ) : (
          <div className="flex items-center gap-2 mt-2">
            <span className="text-3xl font-bold text-[#FF6600]">{balance?.toLocaleString() ?? 0}</span>
            <span className="text-lg text-gray-400">coins</span>
          </div>
        )}
        <p className="text-xs text-gray-500 mt-4">1 coin = ₹100 spent · Coins never expire</p>
      </div>

      {/* Monthly Earned Card (Mocked for UI consistency) */}
      <div className="bg-[#111] p-6 rounded-xl border border-gray-800 relative overflow-hidden">
        <p className="text-sm text-gray-400">Coins earned this month</p>
        <div className="flex items-center gap-2 mt-2">
          <span className="text-3xl font-bold text-[#FF6600]">842</span>
          <span className="text-lg text-gray-400">coins</span>
        </div>
        <p className="text-xs text-green-500 mt-4">↑ 18% vs last month</p>
        <div className="absolute right-4 bottom-2 text-5xl opacity-60">🪙</div>
      </div>
    </div>
  );
}