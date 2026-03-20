/**
 * SOP(표준운영절차) React Query 훅
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getSopList,
  getSopView,
  createSop,
  updateSop,
} from "@/lib/api/sop";
import type {
  SearchSopVO,
  SopVO,
} from "@/lib/types/sop";

// ============================================================================
// Query Keys
// ============================================================================

export const sopKeys = {
  all: ["sops"] as const,
  lists: () => [...sopKeys.all, "list"] as const,
  list: (params: SearchSopVO) =>
    [...sopKeys.lists(), params] as const,
  details: () => [...sopKeys.all, "detail"] as const,
  detail: (id: number) =>
    [...sopKeys.details(), id] as const,
};

// ============================================================================
// Query Hooks
// ============================================================================

/**
 * SOP 목록 조회 훅
 */
export function useSopList(params: SearchSopVO) {
  return useQuery({
    queryKey: sopKeys.list(params),
    queryFn: () => getSopList(params),
    staleTime: 30 * 1000,
  });
}

/**
 * SOP 상세 조회 훅
 */
export function useSopView(id: number) {
  return useQuery({
    queryKey: sopKeys.detail(id),
    queryFn: () => getSopView(id),
    enabled: id > 0,
    staleTime: 60 * 1000,
  });
}

// ============================================================================
// Mutation Hooks
// ============================================================================

/**
 * SOP 등록 훅
 */
export function useCreateSop() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SopVO) => createSop(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: sopKeys.lists() });
    },
  });
}

/**
 * SOP 수정 훅
 */
export function useUpdateSop() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: SopVO }) =>
      updateSop(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: sopKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: sopKeys.detail(variables.id),
      });
    },
  });
}
