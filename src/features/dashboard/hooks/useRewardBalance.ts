import { useQuery } from "@tanstack/react-query";
import { getRewardBalance } from "../api/dashboardApi";

export const rewardBalanceQueryKey = ["dashboard", "reward-balance"];

export function useRewardBalance() {
  return useQuery({
    queryKey: rewardBalanceQueryKey,
    queryFn: getRewardBalance,
  });
}
