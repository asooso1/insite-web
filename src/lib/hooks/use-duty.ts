/**
 * 당직 관리 React Query 훅
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getDuties,
  addDutyType,
  updateDutyType,
  getAccountDuties,
  assignDuty,
  updateAssignedDuty,
  deleteAssignedDuty,
} from "@/lib/api/duty";
import { useAuthStore } from "@/lib/stores/auth-store";
import type {
  SearchDutyVO,
  DutyTypeVO,
  DutyAssignmentVO,
  DutyAssignmentUpdateVO,
} from "@/lib/types/duty";

// ============================================================================
// Query Keys
// ============================================================================

const dutyKeys = {
  all: ["duties"] as const,
  lists: () => [...dutyKeys.all, "list"] as const,
  list: (params: SearchDutyVO & { page?: number; size?: number }) =>
    [...dutyKeys.lists(), params] as const,
  assignments: () => [...dutyKeys.all, "assignments"] as const,
  assignment: (year: number, month: number) =>
    [...dutyKeys.assignments(), { year, month }] as const,
};

// ============================================================================
// 당직 유형 쿼리
// ============================================================================

/**
 * 당직 유형 목록 조회
 */
export function useDutyList(
  params: SearchDutyVO & { page?: number; size?: number } = {}
) {
  const buildingId = useAuthStore((s) => s.user?.currentBuildingId);
  const hasBuildingId = !!buildingId && Number(buildingId) > 0;

  return useQuery({
    queryKey: dutyKeys.list(params),
    queryFn: () => getDuties(params),
    enabled: hasBuildingId,
    staleTime: 30 * 1000,
  });
}

// ============================================================================
// 당직 유형 뮤테이션
// ============================================================================

/**
 * 당직 유형 등록
 */
export function useAddDutyType() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: DutyTypeVO) => addDutyType(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: dutyKeys.lists() });
    },
  });
}

/**
 * 당직 유형 수정
 */
export function useUpdateDutyType() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: DutyTypeVO) => updateDutyType(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: dutyKeys.lists() });
    },
  });
}

// ============================================================================
// 당직 배정 쿼리
// ============================================================================

/**
 * 계정별 당직 배정 조회
 */
export function useAccountDuties(
  year: number,
  month: number,
  params: { page?: number; size?: number } = {}
) {
  const buildingId = useAuthStore((s) => s.user?.currentBuildingId);
  const hasBuildingId = !!buildingId && Number(buildingId) > 0;

  return useQuery({
    queryKey: dutyKeys.assignment(year, month),
    queryFn: () => getAccountDuties(year, month, params),
    enabled: hasBuildingId && year > 0 && month > 0,
    staleTime: 30 * 1000,
  });
}

// ============================================================================
// 당직 배정 뮤테이션
// ============================================================================

/**
 * 당직 배정
 */
export function useAssignDuty() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: DutyAssignmentVO) => assignDuty(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: dutyKeys.assignments() });
    },
  });
}

/**
 * 당직 배정 수정
 */
export function useUpdateAssignedDuty() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: DutyAssignmentUpdateVO) => updateAssignedDuty(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: dutyKeys.assignments() });
    },
  });
}

/**
 * 당직 배정 삭제
 */
export function useDeleteAssignedDuty() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (accountDutyId: number) => deleteAssignedDuty(accountDutyId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: dutyKeys.assignments() });
    },
  });
}
