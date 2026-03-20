/**
 * 민원(Complain) React Query 훅
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getComplainList, getComplainView, createComplain } from "@/lib/api/complain";
import { getBuildingFloors, getBuildingFloorZones } from "@/lib/api/building";
import type { SearchVocVO, VocVO } from "@/lib/types/complain";

// ============================================================================
// Query Keys
// ============================================================================

export const complainKeys = {
  all: ["complains"] as const,
  lists: () => [...complainKeys.all, "list"] as const,
  list: (params: SearchVocVO & { page?: number; size?: number }) =>
    [...complainKeys.lists(), params] as const,
  details: () => [...complainKeys.all, "detail"] as const,
  detail: (id: number) => [...complainKeys.details(), id] as const,
};

export const buildingKeys = {
  all: ["buildings"] as const,
  floors: (buildingId: number) => [...buildingKeys.all, "floors", buildingId] as const,
  zones: (floorId: number) => [...buildingKeys.all, "zones", floorId] as const,
};

// ============================================================================
// Query Hooks
// ============================================================================

/**
 * 빌딩 층 목록 조회 훅
 */
export function useBuildingFloors(buildingId: number) {
  return useQuery({
    queryKey: buildingKeys.floors(buildingId),
    queryFn: () => getBuildingFloors(buildingId),
    enabled: buildingId > 0,
    staleTime: 30 * 1000,
  });
}

/**
 * 빌딩 층 구역 목록 조회 훅
 */
export function useBuildingFloorZones(floorId: number) {
  return useQuery({
    queryKey: buildingKeys.zones(floorId),
    queryFn: () => getBuildingFloorZones(floorId),
    enabled: floorId > 0,
    staleTime: 30 * 1000,
  });
}

/**
 * 민원 목록 조회 훅
 */
export function useComplainList(
  params: SearchVocVO & { page?: number; size?: number }
) {
  return useQuery({
    queryKey: complainKeys.list(params),
    queryFn: () => getComplainList(params),
    staleTime: 30 * 1000,
  });
}

/**
 * 민원 상세 조회 훅
 */
export function useComplainView(id: number) {
  return useQuery({
    queryKey: complainKeys.detail(id),
    queryFn: () => getComplainView(id),
    enabled: id > 0,
    staleTime: 60 * 1000,
  });
}

// ============================================================================
// Mutation Hooks
// ============================================================================

/**
 * 민원 등록 훅
 */
export function useCreateComplain() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: VocVO) => createComplain(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: complainKeys.lists() });
    },
  });
}
