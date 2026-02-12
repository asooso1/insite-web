/**
 * 시설(Facility) React Query 훅
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getFacilityList,
  getFacilityListByBuilding,
  getFacilityView,
  getFacilityNos,
  addFacility,
  updateFacility,
  downloadFacilityListExcel,
  getFacilityWorkOrderList,
  getFacilityHistoryList,
} from "@/lib/api/facility";
import type { SearchFacilityVO, FacilityVO } from "@/lib/types/facility";

// ============================================================================
// Query Keys
// ============================================================================

export const facilityKeys = {
  all: ["facilities"] as const,
  lists: () => [...facilityKeys.all, "list"] as const,
  list: (params: SearchFacilityVO & { page?: number; size?: number }) =>
    [...facilityKeys.lists(), params] as const,
  listByBuilding: (buildingId: number) =>
    [...facilityKeys.lists(), "building", buildingId] as const,
  details: () => [...facilityKeys.all, "detail"] as const,
  detail: (id: number) => [...facilityKeys.details(), id] as const,
  facilityNos: (buildingId: number) =>
    [...facilityKeys.all, "facilityNos", buildingId] as const,
  workOrders: (facilityId: number, page?: number, size?: number) =>
    [...facilityKeys.all, "workOrders", facilityId, page, size] as const,
  history: (params: SearchFacilityVO & { page?: number; size?: number }) =>
    [...facilityKeys.all, "history", params] as const,
};

// ============================================================================
// Query Hooks
// ============================================================================

/**
 * 시설 목록 조회 훅 (페이지네이션)
 */
export function useFacilityList(
  params: SearchFacilityVO & { page?: number; size?: number }
) {
  return useQuery({
    queryKey: facilityKeys.list(params),
    queryFn: () => getFacilityList(params),
  });
}

/**
 * 빌딩별 시설 목록 조회 훅 (전체)
 */
export function useFacilityListByBuilding(buildingId: number) {
  return useQuery({
    queryKey: facilityKeys.listByBuilding(buildingId),
    queryFn: () => getFacilityListByBuilding(buildingId),
    enabled: buildingId > 0,
  });
}

/**
 * 시설 상세 조회 훅
 */
export function useFacilityView(id: number) {
  return useQuery({
    queryKey: facilityKeys.detail(id),
    queryFn: () => getFacilityView(id),
    enabled: id > 0,
  });
}

/**
 * 시설 장비 번호 목록 조회 훅 (중복 체크용)
 */
export function useFacilityNos(buildingId: number) {
  return useQuery({
    queryKey: facilityKeys.facilityNos(buildingId),
    queryFn: () => getFacilityNos(buildingId),
    enabled: buildingId > 0,
  });
}

/**
 * 시설 작업지시 이력 조회 훅
 */
export function useFacilityWorkOrderList(params: {
  facilityId: number;
  page?: number;
  size?: number;
}) {
  return useQuery({
    queryKey: facilityKeys.workOrders(params.facilityId, params.page, params.size),
    queryFn: () => getFacilityWorkOrderList(params),
    enabled: params.facilityId > 0,
  });
}

/**
 * 시설 이력 목록 조회 훅
 */
export function useFacilityHistoryList(
  params: SearchFacilityVO & { page?: number; size?: number }
) {
  return useQuery({
    queryKey: facilityKeys.history(params),
    queryFn: () => getFacilityHistoryList(params),
  });
}

// ============================================================================
// Mutation Hooks
// ============================================================================

/**
 * 시설 등록 훅
 */
export function useAddFacility() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: FacilityVO) => addFacility(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: facilityKeys.lists() });
    },
  });
}

/**
 * 시설 수정 훅
 */
export function useUpdateFacility() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: FacilityVO) => updateFacility(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: facilityKeys.lists() });
      if (variables.id) {
        queryClient.invalidateQueries({
          queryKey: facilityKeys.detail(variables.id),
        });
      }
    },
  });
}

/**
 * 시설 엑셀 다운로드 훅
 */
export function useDownloadFacilityExcel() {
  return useMutation({
    mutationFn: async (params: SearchFacilityVO) => {
      const blob = await downloadFacilityListExcel(params);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `facilities-${new Date().toISOString().split("T")[0]}.xlsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    },
  });
}
