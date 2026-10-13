import { useQuery } from "@tanstack/react-query";
import { getRewardsCatalog } from "../api/dashboardApi";

export const rewardsCatalogQueryKey = ["dashboard", "rewards-catalog"];

export function useRewardsCatalog() {
  return useQuery({
    queryKey: rewardsCatalogQueryKey,
    queryFn: getRewardsCatalog,
  });
}
