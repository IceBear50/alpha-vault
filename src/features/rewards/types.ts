export type RewardBalance = {
  coin_balance: number;
};

export type RewardItem = {
  id: number;
  title: string;
  brand: string;
  cost_coins: number;
  description: string;
  icon_url: string | null;
};

export type RewardsCatalogResponse = {
  rewards: RewardItem[];
};

export type RedeemRewardRequest = {
  reward_id: number;
};

export type RedeemRewardResponse = {
  status: string;
  coins_deducted: number;
  remaining_balance: number;
  voucher_code: string;
};
