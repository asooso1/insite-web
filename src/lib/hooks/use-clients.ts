/**
 * 클라이언트(Client) React Query 훅
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getClientList,
  getClientView,
  checkBusinessNo,
  addClient,
  updateClient,
  deleteClient,
  addBaseArea,
  updateBaseArea,
} from "@/lib/api/client-api";
import type { SearchClientVO, ClientVO, BaseAreaVO } from "@/lib/types/client";

// ============================================================================
// Query Keys
// ============================================================================

export const clientKeys = {
  all: ["clients"] as const,
  lists: () => [...clientKeys.all, "list"] as const,
  list: (params: SearchClientVO & { page?: number; size?: number }) =>
    [...clientKeys.lists(), params] as const,
  details: () => [...clientKeys.all, "detail"] as const,
  detail: (id: number) => [...clientKeys.details(), id] as const,
  checkBusinessNo: (businessNo: string) =>
    [...clientKeys.all, "checkBusinessNo", businessNo] as const,
};

// ============================================================================
// Query Hooks
// ============================================================================

/**
 * 클라이언트 목록 조회 훅 (페이지네이션)
 */
export function useClientList(
  params: SearchClientVO & { page?: number; size?: number }
) {
  return useQuery({
    queryKey: clientKeys.list(params),
    queryFn: () => getClientList(params),
  });
}

/**
 * 클라이언트 상세 조회 훅
 */
export function useClientView(id: number) {
  return useQuery({
    queryKey: clientKeys.detail(id),
    queryFn: () => getClientView(id),
    enabled: id > 0,
  });
}

/**
 * 사업자번호 중복 확인 훅
 */
export function useCheckBusinessNo(businessNo: string) {
  return useQuery({
    queryKey: clientKeys.checkBusinessNo(businessNo),
    queryFn: () => checkBusinessNo(businessNo),
    enabled: businessNo.length >= 10,
  });
}

// ============================================================================
// Mutation Hooks
// ============================================================================

/**
 * 클라이언트 등록 훅
 */
export function useAddClient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ClientVO) => addClient(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: clientKeys.lists() });
    },
  });
}

/**
 * 클라이언트 수정 훅
 */
export function useUpdateClient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ClientVO) => updateClient(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: clientKeys.lists() });
      if (variables.id) {
        queryClient.invalidateQueries({
          queryKey: clientKeys.detail(variables.id),
        });
      }
    },
  });
}

/**
 * 클라이언트 삭제 훅
 */
export function useDeleteClient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteClient(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: clientKeys.lists() });
    },
  });
}

/**
 * 거점 등록 훅
 */
export function useAddBaseArea() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: BaseAreaVO) => addBaseArea(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: clientKeys.detail(variables.companyId),
      });
    },
  });
}

/**
 * 거점 상태 변경 훅
 */
export function useUpdateBaseArea() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: BaseAreaVO) => updateBaseArea(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: clientKeys.detail(variables.companyId),
      });
    },
  });
}
