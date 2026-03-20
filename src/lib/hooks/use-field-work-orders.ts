/**
 * 현장작업지시(Field Work Order) React Query 훅
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getFieldWorkOrderList,
  getFieldWorkOrder,
  createFieldWorkOrder,
  updateFieldWorkOrder,
  addFieldWorkOrderComment,
  deleteFieldWorkOrderComment,
} from "@/lib/api/field-work-order";
import type {
  SearchFieldWorkOrderVO,
  FieldWorkOrderCreateVO,
} from "@/lib/types/field-work-order";

// ============================================================================
// Query Keys
// ============================================================================

export const fieldWorkOrderKeys = {
  all: ["fieldWorkOrders"] as const,
  lists: () => [...fieldWorkOrderKeys.all, "list"] as const,
  list: (params: SearchFieldWorkOrderVO & { page: number; size: number }) =>
    [...fieldWorkOrderKeys.lists(), params] as const,
  details: () => [...fieldWorkOrderKeys.all, "detail"] as const,
  detail: (id: number) => [...fieldWorkOrderKeys.details(), id] as const,
};

// ============================================================================
// Query Hooks
// ============================================================================

/**
 * 현장작업지시 목록 조회 훅 (페이지네이션)
 */
export function useFieldWorkOrderList(
  params: SearchFieldWorkOrderVO & { page: number; size: number }
) {
  return useQuery({
    queryKey: fieldWorkOrderKeys.list(params),
    queryFn: () => getFieldWorkOrderList(params),
    staleTime: 30 * 1000, // 30초 - 목록 쿼리 표준
  });
}

/**
 * 현장작업지시 상세 조회 훅
 */
export function useFieldWorkOrder(id: number) {
  return useQuery({
    queryKey: fieldWorkOrderKeys.detail(id),
    queryFn: () => getFieldWorkOrder(id),
    enabled: !!id,
    staleTime: 60 * 1000, // 1분 - 상세 쿼리 표준
  });
}

// ============================================================================
// Mutation Hooks
// ============================================================================

/**
 * 현장작업지시 등록 훅
 */
export function useCreateFieldWorkOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createFieldWorkOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: fieldWorkOrderKeys.lists() });
    },
  });
}

/**
 * 현장작업지시 수정 훅
 */
export function useUpdateFieldWorkOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: Partial<FieldWorkOrderCreateVO>;
    }) => updateFieldWorkOrder(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: fieldWorkOrderKeys.lists() });
      queryClient.invalidateQueries({ queryKey: fieldWorkOrderKeys.detail(id) });
    },
  });
}

/**
 * 현장작업지시 댓글 등록 훅
 */
export function useAddFieldWorkOrderComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      workOrderId,
      content,
    }: {
      workOrderId: number;
      content: string;
    }) => addFieldWorkOrderComment(workOrderId, content),
    onSuccess: (_, { workOrderId }) => {
      queryClient.invalidateQueries({
        queryKey: fieldWorkOrderKeys.detail(workOrderId),
      });
    },
  });
}

/**
 * 현장작업지시 댓글 삭제 훅
 */
export function useDeleteFieldWorkOrderComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      workOrderId,
      commentId,
    }: {
      workOrderId: number;
      commentId: number;
    }) => deleteFieldWorkOrderComment(workOrderId, commentId),
    onSuccess: (_, { workOrderId }) => {
      queryClient.invalidateQueries({
        queryKey: fieldWorkOrderKeys.detail(workOrderId),
      });
    },
  });
}
