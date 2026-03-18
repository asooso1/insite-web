/**
 * 청구서(Invoice) React Query 훅
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getServiceChargeList,
  getServiceChargeView,
  addServiceCharge,
  editServiceCharge,
  deleteServiceCharge,
} from "@/lib/api/invoice";
import type { SearchServiceChargeVO, ServiceChargeVO } from "@/lib/types/invoice";

// ============================================================================
// Query Keys
// ============================================================================

export const invoiceKeys = {
  all: ["invoices"] as const,
  lists: () => [...invoiceKeys.all, "list"] as const,
  list: (params: SearchServiceChargeVO) => [...invoiceKeys.lists(), params] as const,
  details: () => [...invoiceKeys.all, "detail"] as const,
  detail: (id: number) => [...invoiceKeys.details(), id] as const,
};

// ============================================================================
// Query Hooks
// ============================================================================

/**
 * 서비스 요금 청구서 목록 조회 훅
 */
export function useServiceChargeList(params: SearchServiceChargeVO) {
  return useQuery({
    queryKey: invoiceKeys.list(params),
    queryFn: () => getServiceChargeList(params),
    staleTime: 30 * 1000, // 30초
  });
}

/**
 * 서비스 요금 청구서 상세 조회 훅
 */
export function useServiceChargeView(id: number) {
  return useQuery({
    queryKey: invoiceKeys.detail(id),
    queryFn: () => getServiceChargeView(id),
    enabled: id > 0,
    staleTime: 60 * 1000, // 1분
  });
}

// ============================================================================
// Mutation Hooks
// ============================================================================

/**
 * 서비스 요금 청구서 등록 훅
 */
export function useAddServiceCharge() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ServiceChargeVO) => addServiceCharge(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: invoiceKeys.lists() });
    },
  });
}

/**
 * 서비스 요금 청구서 수정 훅
 */
export function useEditServiceCharge() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ServiceChargeVO & { id: number }) => editServiceCharge(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: invoiceKeys.lists() });
      queryClient.invalidateQueries({ queryKey: invoiceKeys.details() });
    },
  });
}

/**
 * 서비스 요금 청구서 삭제 훅
 */
export function useDeleteServiceCharge() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteServiceCharge(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: invoiceKeys.lists() });
      queryClient.invalidateQueries({ queryKey: invoiceKeys.details() });
    },
  });
}
