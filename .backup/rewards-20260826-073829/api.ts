import type {
  CatalogResponse,
  RedeemRewardResponse,
  RewardBalance,
} from "./types";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ??
  "https://alpha-vault-backend-a97d.onrender.com/api/v1";

export async function fetchRewardBalance(): Promise<RewardBalance> {
  const response = await fetch(`${API_BASE_URL}/rewards/balance`);

  if (!response.ok) {
    throw new Error("Failed to fetch reward balance");
  }

  return response.json();
}

export async function fetchRewardCatalog(): Promise<CatalogResponse> {
  const response = await fetch(`${API_BASE_URL}/rewards/catalog`);

  if (!response.ok) {
    throw new Error("Failed to fetch reward catalog");
  }

  const data = await response.json();

  return {
    rewards: Array.isArray(data) ? data : data.rewards ?? [],
  };
}

export async function redeemReward(
  rewardId: number,
): Promise<RedeemRewardResponse> {
  const response = await fetch(`${API_BASE_URL}/rewards/redeem`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      reward_id: rewardId,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();

    throw new Error(
      errorBody || "Failed to redeem reward",
    );
  }

  return response.json();
}
