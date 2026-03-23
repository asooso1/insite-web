import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getUserBuildings,
  getAdminBuildings,
  getBuildingList,
  getBuildingView,
  addBuilding,
  editBuilding,
  deleteBuilding,
  downloadBuildingListExcel,
  type BuildingInfoDTO,
  type CommonListDTO,
} from "@/lib/api/building";
import type { SearchBuildingVO, BuildingSaveVO } from "@/lib/types/building";

export const buildingKeys = {
  all: ["buildings"] as const,
  lists: () => [...buildingKeys.all, "list"] as const,
  list: (params: SearchBuildingVO & { page?: number; size?: number }) =>
    [...buildingKeys.lists(), params] as const,
  details: () => [...buildingKeys.all, "detail"] as const,
  detail: (id: number) => [...buildingKeys.details(), id] as const,
  userBuildings: (userId: string) => ["buildings", "user", userId] as const,
  adminBuildings: (keyword: string) => ["buildings", "admin", keyword] as const,
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

/**
 * 관리자 전용 전체 빌딩 목록 조회 훅
 * - ROLE_LABS_SYSTEM_ADMIN, ROLE_SYSTEM_ADMIN 전용
 * - GET /open/common/searchCommonList (keyword 빈 문자열 → 전체 반환)
 */
export function useAdminBuildings(enabled: boolean): {
  buildings: CommonListDTO[];
  isLoading: boolean;
} {
  const { data, isLoading } = useQuery({
    queryKey: buildingKeys.adminBuildings(""),
    queryFn: () => getAdminBuildings(""),
    enabled,
    staleTime: 5 * 60 * 1000, // 5분
    retry: false,
  });

  return {
    buildings: data ?? [],
    isLoading,
  };
}

// ============================================================================
// 건물 관리 훅
// ============================================================================

export function useBuildingList(
  params: SearchBuildingVO & { page?: number; size?: number }
) {
  return useQuery({
    queryKey: buildingKeys.list(params),
    queryFn: () => getBuildingList(params),
    staleTime: 30 * 1000,
  });
}

export function useBuildingView(id: number) {
  return useQuery({
    queryKey: buildingKeys.detail(id),
    queryFn: () => getBuildingView(id),
    enabled: id > 0,
    staleTime: 60 * 1000,
  });
}

export function useAddBuilding() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: BuildingSaveVO) => addBuilding(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: buildingKeys.lists() });
    },
  });
}

export function useEditBuilding() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: BuildingSaveVO) => editBuilding(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: buildingKeys.lists() });
      if (variables.id) {
        queryClient.invalidateQueries({ queryKey: buildingKeys.detail(variables.id) });
      }
    },
  });
}

export function useDeleteBuilding() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteBuilding(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: buildingKeys.lists() });
    },
  });
}

export function useDownloadBuildingExcel() {
  return useMutation({
    mutationFn: async (params: SearchBuildingVO) => {
      const blob = await downloadBuildingListExcel(params);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `buildings-${new Date().toISOString().split("T")[0]}.xlsx`;
      document.body.appendChild(a);
      try {
        a.click();
        window.URL.revokeObjectURL(url);
      } finally {
        if (a.parentNode) document.body.removeChild(a);
      }
    },
  });
}
