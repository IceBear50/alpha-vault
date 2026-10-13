import { ArrowRight, Gift } from "lucide-react";
import type { Reward } from "../types/api";
import { getMerchantAvatarStyle } from "../utils/merchant";

export type RewardsPromoCardProps = {
  rewards: Reward[];
  onExploreRewards?: () => void;
};

export function RewardsPromoCard({
  rewards,
  onExploreRewards,
}: RewardsPromoCardProps) {
  const popularRewards = rewards.slice(0, 4);

  return (
    <section className="flex h-full flex-col items-center overflow-hidden rounded-2xl border border-[#FF6600]/15 bg-gradient-to-b from-[#1A0F05] to-[#0D0D0D] p-6 text-center">
      <div className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#FF6600]/10">
        <div
          aria-hidden="true"
          className="absolute inset-0 rounded-2xl bg-[#FF6600]/20 blur-xl"
        />
        <Gift aria-hidden="true" className="relative h-8 w-8 text-[#FF6600]" />
      </div>

      <h2 className="mt-5 text-lg font-semibold tracking-tight text-white">
        Rewards that <span className="text-[#FF6600]">matter</span>
      </h2>

      <p className="mt-2 max-w-[220px] text-sm leading-5 text-[#9C9691]">
        Redeem your coins for exciting vouchers, cashback and more.
      </p>

      <button
        type="button"
        onClick={onExploreRewards}
        className="mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#FF6600] text-sm font-semibold text-white transition-colors hover:bg-[#ff7a1a]"
      >
        Explore rewards
        <ArrowRight aria-hidden="true" className="h-4 w-4" />
      </button>

      {popularRewards.length > 0 && (
        <div className="mt-7 w-full text-left">
          <p className="text-xs font-medium text-[#77716B]">
            Popular rewards
          </p>

          <ul className="mt-3 flex items-center gap-2">
            {popularRewards.map((reward) => {
              const avatar = getMerchantAvatarStyle(reward.brand);

              return (
                <li key={reward.reward_id}>
                  <span
                    aria-hidden="true"
                    title={reward.brand}
                    className="flex h-9 w-9 items-center justify-center rounded-lg text-xs font-semibold"
                    style={{
                      backgroundColor: avatar.bg,
                      color: avatar.text,
                    }}
                  >
                    {reward.brand.charAt(0).toUpperCase()}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </section>
  );
}
