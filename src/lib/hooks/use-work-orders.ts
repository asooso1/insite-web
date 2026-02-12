/**
 * 작업지시(Work Order) React Query 훅
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getWorkOrderList,
  getWorkOrderView,
  getWorkOrderStatePerCount,
  createWorkOrder,
  updateWorkOrder,
  copyWorkOrder,
  issueWorkOrder,
  requestCompleteWorkOrder,
  approveWorkOrder,
  denyWorkOrder,
  approveMultiWorkOrder,
  cancelMultiWorkOrder,
  addWorkOrderResult,
  downloadWorkOrderListExcel,
} from "@/lib/api/work-order";
import type {
  SearchWorkOrderVO,
  WorkOrderVO,
  WorkOrderResultVO,
} from "@/lib/types/work-order";

// ============================================================================
// Query Keys
// ============================================================================

export const workOrderKeys = {
  all: ["workOrders"] as const,
  lists: () => [...workOrderKeys.all, "list"] as const,
  list: (params: SearchWorkOrderVO & { page?: number; size?: number }) =>
    [...workOrderKeys.lists(), params] as const,
  details: () => [...workOrderKeys.all, "detail"] as const,
  detail: (id: number, type: "view" | "edit") =>
    [...workOrderKeys.details(), id, type] as const,
  stateCount: (params: SearchWorkOrderVO) =>
    [...workOrderKeys.all, "stateCount", params] as const,
};

// ============================================================================
// Query Hooks
// ============================================================================

/**
 * 작업지시 목록 조회 훅
 */
export function useWorkOrderList(
  params: SearchWorkOrderVO & { page?: number; size?: number }
) {
  return useQuery({
    queryKey: workOrderKeys.list(params),
    queryFn: () => getWorkOrderList(params),
  });
}

/**
 * 작업지시 상세 조회 훅
 */
export function useWorkOrderView(id: number, type: "view" | "edit" = "view") {
  return useQuery({
    queryKey: workOrderKeys.detail(id, type),
    queryFn: () => getWorkOrderView(type, id),
    enabled: id > 0,
  });
}

/**
 * 작업지시 상태별 건수 조회 훅
 */
export function useWorkOrderStateCount(params: SearchWorkOrderVO) {
  return useQuery({
    queryKey: workOrderKeys.stateCount(params),
    queryFn: () => getWorkOrderStatePerCount(params),
  });
}

// ============================================================================
// Mutation Hooks
// ============================================================================

/**
 * 작업지시 등록 훅
 */
export function useCreateWorkOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: WorkOrderVO) => createWorkOrder(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: workOrderKeys.lists() });
    },
  });
}

/**
 * 작업지시 수정 훅
 */
export function useUpdateWorkOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: WorkOrderVO) => updateWorkOrder(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: workOrderKeys.lists() });
      if (variables.id) {
        queryClient.invalidateQueries({
          queryKey: workOrderKeys.detail(variables.id, "view"),
        });
        queryClient.invalidateQueries({
          queryKey: workOrderKeys.detail(variables.id, "edit"),
        });
      }
    },
  });
}

/**
 * 작업지시 복사 훅
 */
export function useCopyWorkOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (workOrderId: number) => copyWorkOrder(workOrderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: workOrderKeys.lists() });
    },
  });
}

/**
 * 작업지시 발행 훅
 */
export function useIssueWorkOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (workOrderId: number) => issueWorkOrder(workOrderId),
    onSuccess: (_, workOrderId) => {
      queryClient.invalidateQueries({ queryKey: workOrderKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: workOrderKeys.detail(workOrderId, "view"),
      });
    },
  });
}

/**
 * 작업지시 완료 요청 훅
 */
export function useRequestCompleteWorkOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (workOrderId: number) => requestCompleteWorkOrder(workOrderId),
    onSuccess: (_, workOrderId) => {
      queryClient.invalidateQueries({ queryKey: workOrderKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: workOrderKeys.detail(workOrderId, "view"),
      });
    },
  });
}

/**
 * 작업지시 승인 훅
 */
export function useApproveWorkOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: WorkOrderResultVO) => approveWorkOrder(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: workOrderKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: workOrderKeys.detail(variables.workOrderId, "view"),
      });
    },
  });
}

/**
 * 작업지시 반려 훅
 */
export function useDenyWorkOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: WorkOrderResultVO) => denyWorkOrder(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: workOrderKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: workOrderKeys.detail(variables.workOrderId, "view"),
      });
    },
  });
}

/**
 * 다중 승인 훅
 */
export function useApproveMultiWorkOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (workOrderIds: number[]) => approveMultiWorkOrder(workOrderIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: workOrderKeys.lists() });
    },
  });
}

/**
 * 다중 취소 훅
 */
export function useCancelMultiWorkOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (workOrderIds: number[]) => cancelMultiWorkOrder(workOrderIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: workOrderKeys.lists() });
    },
  });
}

/**
 * 작업지시 결과 등록 훅
 */
export function useAddWorkOrderResult() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: WorkOrderResultVO) => addWorkOrderResult(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: workOrderKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: workOrderKeys.detail(variables.workOrderId, "view"),
      });
    },
  });
}

/**
 * 엑셀 다운로드 훅
 */
export function useDownloadWorkOrderExcel() {
  return useMutation({
    mutationFn: async (params: SearchWorkOrderVO) => {
      const blob = await downloadWorkOrderListExcel(params);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `work-orders-${new Date().toISOString().split("T")[0]}.xlsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    },
  });
}
