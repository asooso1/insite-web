import { useQuery } from "@tanstack/react-query";
import { getUserBuildings, type BuildingInfoDTO } from "@/lib/api/building";

const buildingKeys = {
  all: ["buildings"] as const,
  userBuildings: (userId: string) => ["buildings", "user", userId] as const,
};

/**
 * 현재 사용자의 빌딩 목록 조회 훅
 * - 권한 오류(401) 발생 시 빈 배열 반환 (로그아웃 트리거 없음)
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
    retry: false, // 권한 오류 시 재시도 불필요
  });

  return {
    buildings: data?.buildings ?? [],
    isLoading,
  };
}
