/**
 * 클라이언트(Client/Company) React Query 훅
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getClientList,
  getClientView,
  addClient,
  editClient,
  deleteClient,
  addBaseArea,
  editBaseAreaState,
  downloadClientListExcel,
} from "@/lib/api/company";
import type {
  SearchClientVO,
  ClientAddVO,
  ClientEditVO,
  ClientBaseAreaAddVO,
  BaseAreaVO,
} from "@/lib/types/client";

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

// ============================================================================
// Mutation Hooks
// ============================================================================

/**
 * 클라이언트 등록 훅
 */
export function useAddClient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ClientAddVO) => addClient(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: clientKeys.lists() });
    },
  });
}

/**
 * 클라이언트 수정 훅
 */
export function useEditClient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ClientEditVO) => editClient(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: clientKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: clientKeys.detail(variables.id),
      });
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
    mutationFn: (data: ClientBaseAreaAddVO) => addBaseArea(data),
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
export function useEditBaseAreaState(companyId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: BaseAreaVO) => editBaseAreaState(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: clientKeys.detail(companyId),
      });
    },
  });
}

/**
 * 클라이언트 엑셀 다운로드 훅
 */
export function useDownloadClientExcel() {
  return useMutation({
    mutationFn: async (params: SearchClientVO) => {
      const blob = await downloadClientListExcel(params);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `clients-${new Date().toISOString().split("T")[0]}.xlsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    },
  });
}
