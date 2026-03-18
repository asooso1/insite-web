/**
 * 제어(Control) React Query 훅
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getControlList,
  getControlView,
  addControl,
  updateControl,
  sendControlRequest,
  cancelControlRequest,
  deleteControlRequest,
} from "@/lib/api/control";
import type { ControlVO, ControlRequestVO, SearchControlVO } from "@/lib/types/control";

// ============================================================================
// Query Keys
// ============================================================================

export const controlKeys = {
  all: ["controls"] as const,
  lists: () => [...controlKeys.all, "list"] as const,
  list: (params: SearchControlVO & { page?: number; size?: number }) =>
    [...controlKeys.lists(), params] as const,
  details: () => [...controlKeys.all, "detail"] as const,
  detail: (id: number) => [...controlKeys.details(), id] as const,
};

// ============================================================================
// Query Hooks
// ============================================================================

/**
 * 제어 목록 조회 훅 (페이지네이션)
 */
export function useControlList(
  params: SearchControlVO & { page?: number; size?: number }
) {
  return useQuery({
    queryKey: controlKeys.list(params),
    queryFn: () => getControlList(params),
    staleTime: 30 * 1000, // 30초 - 목록 쿼리 표준
  });
}

/**
 * 제어 상세 조회 훅
 */
export function useControlView(id: number) {
  return useQuery({
    queryKey: controlKeys.detail(id),
    queryFn: () => getControlView(id),
    enabled: id > 0,
    staleTime: 60 * 1000, // 1분 - 상세 쿼리 표준
  });
}

// ============================================================================
// Mutation Hooks
// ============================================================================

/**
 * 제어 등록 훅
 */
export function useAddControl() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ControlVO) => addControl(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: controlKeys.lists() });
    },
  });
}

/**
 * 제어 수정 훅
 */
export function useUpdateControl() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ControlVO) => updateControl(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: controlKeys.lists() });
      if (variables.id) {
        queryClient.invalidateQueries({
          queryKey: controlKeys.detail(variables.id),
        });
      }
    },
  });
}

/**
 * 제어 요청 전송 훅
 */
export function useSendControlRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ControlRequestVO) => sendControlRequest(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: controlKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: controlKeys.detail(variables.id),
      });
    },
  });
}

/**
 * 제어 요청 취소 훅
 */
export function useCancelControlRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ControlRequestVO) => cancelControlRequest(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: controlKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: controlKeys.detail(variables.id),
      });
    },
  });
}

/**
 * 제어 삭제 훅
 */
export function useDeleteControl() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteControlRequest(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: controlKeys.lists() });
    },
  });
}
