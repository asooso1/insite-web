/**
 * 자재(Material) React Query 훅
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getMaterialList,
  getMaterialView,
  addMaterial,
  editMaterial,
  deleteMaterial,
  addMaterialStock,
} from "@/lib/api/material";
import type { SearchMaterialVO, MaterialVO, MaterialStockVO } from "@/lib/types/material";

// ============================================================================
// Query Keys
// ============================================================================

export const materialKeys = {
  all: ["materials"] as const,
  lists: () => [...materialKeys.all, "list"] as const,
  list: (params: SearchMaterialVO & { page?: number; size?: number }) =>
    [...materialKeys.lists(), params] as const,
  details: () => [...materialKeys.all, "detail"] as const,
  detail: (id: number) => [...materialKeys.details(), id] as const,
};

// ============================================================================
// Query Hooks
// ============================================================================

/**
 * 자재 목록 조회 훅 (페이지네이션)
 */
export function useMaterialList(
  params: SearchMaterialVO & { page?: number; size?: number }
) {
  return useQuery({
    queryKey: materialKeys.list(params),
    queryFn: () => getMaterialList(params),
  });
}

/**
 * 자재 상세 조회 훅
 */
export function useMaterialView(id: number) {
  return useQuery({
    queryKey: materialKeys.detail(id),
    queryFn: () => getMaterialView(id),
    enabled: id > 0,
  });
}

// ============================================================================
// Mutation Hooks
// ============================================================================

/**
 * 자재 등록 훅
 */
export function useAddMaterial() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: MaterialVO) => addMaterial(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: materialKeys.lists() });
    },
  });
}

/**
 * 자재 수정 훅
 */
export function useEditMaterial() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: MaterialVO) => editMaterial(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: materialKeys.lists() });
      if (variables.id) {
        queryClient.invalidateQueries({
          queryKey: materialKeys.detail(variables.id),
        });
      }
    },
  });
}

/**
 * 자재 삭제 훅
 */
export function useDeleteMaterial() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteMaterial(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: materialKeys.lists() });
    },
  });
}

/**
 * 재고 조정 (입고/출고) 훅
 */
export function useAddMaterialStock() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: MaterialStockVO) => addMaterialStock(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: materialKeys.detail(variables.materialId),
      });
      queryClient.invalidateQueries({ queryKey: materialKeys.lists() });
    },
  });
}
