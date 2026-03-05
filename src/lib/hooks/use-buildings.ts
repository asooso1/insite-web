import { useQuery } from "@tanstack/react-query";
import { getUserBuildings, type BuildingInfoDTO } from "@/lib/api/building";

const buildingKeys = {
  all: ["buildings"] as const,
  userBuildings: (userId: string) => ["buildings", "user", userId] as const,
};

/**
 * 현재 사용자의 빌딩 목록 조회 훅
 */
export function useUserBuildings(userId: string | undefined): {
  buildings: BuildingInfoDTO[];
  isLoading: boolean;
} {
  const { data, isLoading } = useQuery({
    queryKey: buildingKeys.userBuildings(userId ?? ""),
    queryFn: () => getUserBuildings(userId!),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5분
  });

  return {
    buildings: data?.buildings ?? [],
    isLoading,
  };
}
