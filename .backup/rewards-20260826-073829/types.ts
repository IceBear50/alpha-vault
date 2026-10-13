export interface RewardBalance {
  coin_balance: number;
}

export interface RewardItem {
  reward_id: number;
  id: number;
  title: string;
  brand: string;
  cost_coins: number;
  description: string;
  icon_url: string | null;
}

export interface CatalogResponse {
  rewards: RewardItem[];
}

export interface RedeemRewardResponse {
  status: string;
  coins_deducted: number;
  remaining_balance: number;
  voucher_code: string;
}
