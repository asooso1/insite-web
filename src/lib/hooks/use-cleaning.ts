/**
 * 청소 관리 React Query 훅
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getCleanInfoList,
  getCleaningBimView,
  addCleaningBim,
  editCleaningBim,
  deleteCleaningBim,
} from "@/lib/api/cleaning";
import type { SearchCleanVO, CleanInfoVO } from "@/lib/types/cleaning";

// ============================================================================
// Query Keys
// ============================================================================

const cleaningKeys = {
  all: ["cleaning"] as const,
  lists: () => [...cleaningKeys.all, "list"] as const,
  list: (params: SearchCleanVO & { page?: number; size?: number }) =>
    [...cleaningKeys.lists(), params] as const,
  details: () => [...cleaningKeys.all, "detail"] as const,
  detail: (id: number) => [...cleaningKeys.details(), id] as const,
};

// ============================================================================
// 청소업체 목록 쿼리
// ============================================================================

/**
 * 청소업체 목록 조회
 */
export function useCleanInfoList(
  params: SearchCleanVO & { page?: number; size?: number } = {}
) {
  return useQuery({
    queryKey: cleaningKeys.list(params),
    queryFn: () => getCleanInfoList(params),
    staleTime: 30 * 1000,
  });
}

// ============================================================================
// 청소업체 상세 쿼리
// ============================================================================

/**
 * 청소업체 상세 조회
 */
export function useCleaningBimView(id: number) {
  return useQuery({
    queryKey: cleaningKeys.detail(id),
    queryFn: () => getCleaningBimView(id),
    enabled: id > 0,
    staleTime: 60 * 1000,
  });
}

// ============================================================================
// 청소업체 뮤테이션
// ============================================================================

/**
 * 청소업체 등록
 */
export function useAddCleaningBim() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CleanInfoVO) => addCleaningBim(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cleaningKeys.lists() });
    },
  });
}

/**
 * 청소업체 수정
 */
export function useEditCleaningBim() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CleanInfoVO) => editCleaningBim(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cleaningKeys.lists() });
      queryClient.invalidateQueries({ queryKey: cleaningKeys.details() });
    },
  });
}

/**
 * 청소업체 삭제
 */
export function useDeleteCleaningBim() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteCleaningBim(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cleaningKeys.lists() });
      queryClient.invalidateQueries({ queryKey: cleaningKeys.details() });
    },
  });
}
