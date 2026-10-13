import apiClient from "@/lib/api/client/apiClient";
import type {
  RedeemRewardRequest,
  RedeemRewardResponse,
  RewardBalance,
  RewardItem,
  RewardsCatalogResponse,
} from "./types";

type LegacyRewardItem = {
  reward_id: number;
  brand: string;
  description: string;
  coin_cost: number;
};

export async function fetchRewardBalance(): Promise<RewardBalance> {
  const response = await apiClient.get<RewardBalance & { balance?: number }>("/rewards/balance");

  return { coin_balance: response.data.coin_balance ?? response.data.balance ?? 0 };
}

export async function fetchRewardCatalog(): Promise<RewardsCatalogResponse> {
  const response = await apiClient.get<
    RewardItem[] | LegacyRewardItem[] | RewardsCatalogResponse | { rewards: LegacyRewardItem[] }
  >("/rewards/catalog");

  const data = response.data;
  const rewards = Array.isArray(data) ? data : data.rewards;

  return {
    rewards: rewards.map((reward) =>
      "cost_coins" in reward
        ? reward
        : {
            id: reward.reward_id,
            title: `${reward.brand} Voucher`,
            brand: reward.brand,
            cost_coins: reward.coin_cost,
            description: reward.description,
            icon_url: null,
          },
    ),
  };
}

export async function redeemReward(rewardId: number): Promise<RedeemRewardResponse> {
  const payload: RedeemRewardRequest = {
    reward_id: rewardId,
  };

  const response = await apiClient.post<RedeemRewardResponse>("/rewards/redeem", payload);

  return response.data;
}
