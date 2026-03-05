/**
 * TBM(작업전미팅) React Query 훅
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getTbmList,
  getTbmView,
  createTbm,
  updateTbm,
} from "@/lib/api/tbm";
import type {
  SearchTbmVO,
  TbmVO,
} from "@/lib/types/tbm";

// ============================================================================
// Query Keys
// ============================================================================

export const tbmKeys = {
  all: ["tbms"] as const,
  lists: () => [...tbmKeys.all, "list"] as const,
  list: (params: SearchTbmVO & { page?: number; size?: number }) =>
    [...tbmKeys.lists(), params] as const,
  details: () => [...tbmKeys.all, "detail"] as const,
  detail: (id: number) =>
    [...tbmKeys.details(), id] as const,
};

// ============================================================================
// Query Hooks
// ============================================================================

/**
 * TBM 목록 조회 훅
 */
export function useTbmList(
  params: SearchTbmVO & { page?: number; size?: number }
) {
  return useQuery({
    queryKey: tbmKeys.list(params),
    queryFn: () => getTbmList(params),
  });
}

/**
 * TBM 상세 조회 훅
 */
export function useTbmView(id: number) {
  return useQuery({
    queryKey: tbmKeys.detail(id),
    queryFn: () => getTbmView(id),
    enabled: id > 0,
  });
}

// ============================================================================
// Mutation Hooks
// ============================================================================

/**
 * TBM 등록 훅
 */
export function useCreateTbm() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: TbmVO) => createTbm(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tbmKeys.lists() });
    },
  });
}

/**
 * TBM 수정 훅
 */
export function useUpdateTbm() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: TbmVO }) =>
      updateTbm(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: tbmKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: tbmKeys.detail(variables.id),
      });
    },
  });
}
