import apiClient from "@/lib/api/client/apiClient";
import type {
  RedeemRewardRequest,
  RedeemRewardResponse,
  RewardBalanceResponse,
  RewardsCatalogResponse,
  Reward,
  SpendAnalyticsQueryParams,
  SpendAnalyticsResponse,
  TransactionQueryParams,
  TransactionsResponse,
} from "../types/api";

export async function getTransactions(
  params?: TransactionQueryParams,
): Promise<TransactionsResponse> {
  const response = await apiClient.get<TransactionsResponse>("/transactions", {
    params,
  });

  return response.data;
}

export async function getSpendAnalytics(
  params?: SpendAnalyticsQueryParams,
): Promise<SpendAnalyticsResponse> {
  const response = await apiClient.get<SpendAnalyticsResponse>("/analytics/spend", {
    params,
  });

  return response.data;
}

export async function getRewardBalance(): Promise<RewardBalanceResponse> {
  const response = await apiClient.get<RewardBalanceResponse & { coin_balance?: number }>(
    "/rewards/balance",
  );

  return { balance: response.data.balance ?? response.data.coin_balance ?? 0 };
}

export async function getRewardsCatalog(): Promise<RewardsCatalogResponse> {
  const response = await apiClient.get<
    | RewardsCatalogResponse
    | Array<
        | Reward
        | {
            id: number;
            title: string;
            brand: string;
            cost_coins: number;
            description: string;
            icon_url: string | null;
          }
      >
  >("/rewards/catalog");

  const rewards = Array.isArray(response.data) ? response.data : response.data.rewards;

  return {
    rewards: rewards.map((reward) =>
      "reward_id" in reward
        ? reward
        : {
            reward_id: reward.id,
            brand: reward.brand,
            description: reward.description,
            coin_cost: reward.cost_coins,
          },
    ),
  };
}

export async function redeemReward(payload: RedeemRewardRequest): Promise<RedeemRewardResponse> {
  const response = await apiClient.post<RedeemRewardResponse>("/rewards/redeem", payload);

  return response.data;
}
