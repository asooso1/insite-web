/**
 * 개인 작업지시(Personal Work Order) React Query 훅
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getPersonalWorkOrderList,
  getPersonalWorkOrderDetail,
  createPersonalWorkOrder,
  updatePersonalWorkOrder,
  confirmPersonalWorkOrder,
} from "@/lib/api/personal-work-order";
import type {
  SearchPersonalWorkOrderVO,
  PersonalWorkOrderVO,
  PersonalWorkOrderUpdateVO,
  PersonalWorkOrderConfirmVO,
} from "@/lib/types/personal-work-order";

// ============================================================================
// Query Keys
// ============================================================================

export const personalWorkOrderKeys = {
  all: ["personalWorkOrders"] as const,
  lists: () => [...personalWorkOrderKeys.all, "list"] as const,
  list: (params: SearchPersonalWorkOrderVO & { page?: number; size?: number }) =>
    [...personalWorkOrderKeys.lists(), params] as const,
  details: () => [...personalWorkOrderKeys.all, "detail"] as const,
  detail: (id: number) =>
    [...personalWorkOrderKeys.details(), id] as const,
};

// ============================================================================
// Query Hooks
// ============================================================================

/**
 * 개인 작업 목록 조회 훅
 */
export function usePersonalWorkOrderList(
  params: SearchPersonalWorkOrderVO & { page?: number; size?: number }
) {
  return useQuery({
    queryKey: personalWorkOrderKeys.list(params),
    queryFn: () => getPersonalWorkOrderList(params),
    staleTime: 30 * 1000, // 30초 - 목록 쿼리 표준
  });
}

/**
 * 개인 작업 상세 조회 훅
 */
export function usePersonalWorkOrderDetail(id: number) {
  return useQuery({
    queryKey: personalWorkOrderKeys.detail(id),
    queryFn: () => getPersonalWorkOrderDetail(id),
    enabled: id > 0,
    staleTime: 60 * 1000, // 1분 - 상세 쿼리 표준
  });
}

// ============================================================================
// Mutation Hooks
// ============================================================================

/**
 * 개인 작업 등록 뮤테이션 훅
 */
export function useAddPersonalWorkOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: PersonalWorkOrderVO) =>
      createPersonalWorkOrder(data),
    onSuccess: () => {
      // 목록 캐시 무효화
      queryClient.invalidateQueries({
        queryKey: personalWorkOrderKeys.lists(),
      });
    },
  });
}

/**
 * 개인 작업 수정 뮤테이션 훅
 */
export function useUpdatePersonalWorkOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: PersonalWorkOrderUpdateVO) =>
      updatePersonalWorkOrder(data),
    onSuccess: (result) => {
      // 상세 캐시 업데이트
      queryClient.setQueryData(
        personalWorkOrderKeys.detail(result.personalWorkOrderId),
        result
      );
      // 목록 캐시 무효화
      queryClient.invalidateQueries({
        queryKey: personalWorkOrderKeys.lists(),
      });
    },
  });
}

/**
 * 개인 작업 확인 뮤테이션 훅
 */
export function useConfirmPersonalWorkOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: PersonalWorkOrderConfirmVO) =>
      confirmPersonalWorkOrder(data),
    onSuccess: (result) => {
      // 상세 캐시 업데이트
      queryClient.setQueryData(
        personalWorkOrderKeys.detail(result.personalWorkOrderId),
        result
      );
      // 목록 캐시 무효화
      queryClient.invalidateQueries({
        queryKey: personalWorkOrderKeys.lists(),
      });
    },
  });
}
