/**
 * 태그(NFC/QR) React Query 훅
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getTagList,
  getTagDetail,
  createTag,
  updateTag,
  deleteTag,
} from "@/lib/api/tag";
import type {
  SearchQrNfcVO,
  QrNfcVO,
} from "@/lib/types/tag";

// ============================================================================
// Query Keys
// ============================================================================

export const tagKeys = {
  all: ["tags"] as const,
  lists: () => [...tagKeys.all, "list"] as const,
  list: (params: SearchQrNfcVO) => [...tagKeys.lists(), params] as const,
  details: () => [...tagKeys.all, "detail"] as const,
  detail: (id: number) => [...tagKeys.details(), id] as const,
};

// ============================================================================
// Query Hooks
// ============================================================================

/**
 * 태그 목록 조회 훅
 */
export function useTagList(params: SearchQrNfcVO) {
  return useQuery({
    queryKey: tagKeys.list(params),
    queryFn: () => getTagList(params),
    staleTime: 30 * 1000,
  });
}

/**
 * 태그 상세 조회 훅
 */
export function useTagDetail(id: number) {
  return useQuery({
    queryKey: tagKeys.detail(id),
    queryFn: () => getTagDetail(id),
    enabled: id > 0,
    staleTime: 60 * 1000,
  });
}

// ============================================================================
// Mutation Hooks
// ============================================================================

/**
 * 태그 생성 훅
 */
export function useCreateTag() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: QrNfcVO) => createTag(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tagKeys.lists() });
    },
  });
}

/**
 * 태그 수정 훅
 */
export function useUpdateTag() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: QrNfcVO) => updateTag(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: tagKeys.lists() });
      if (variables.id) {
        queryClient.invalidateQueries({
          queryKey: tagKeys.detail(variables.id),
        });
      }
    },
  });
}

/**
 * 태그 삭제 훅
 */
export function useDeleteTag() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteTag(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tagKeys.lists() });
    },
  });
}
