/**
 * 임차(Rental) React Query 훅
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getRentalList,
  getRentalView,
  addRental,
  editRental,
  deleteRental,
} from "@/lib/api/rental";
import type { SearchRentalVO, RentalVO } from "@/lib/types/rental";

// ============================================================================
// Query Keys
// ============================================================================

export const rentalKeys = {
  all: ["rentals"] as const,
  lists: () => [...rentalKeys.all, "list"] as const,
  list: (params: SearchRentalVO) => [...rentalKeys.lists(), params] as const,
  details: () => [...rentalKeys.all, "detail"] as const,
  detail: (id: number) => [...rentalKeys.details(), id] as const,
};

// ============================================================================
// Query Hooks
// ============================================================================

/**
 * 임차 관리 목록 조회 훅
 */
export function useRentalList(params: SearchRentalVO) {
  return useQuery({
    queryKey: rentalKeys.list(params),
    queryFn: () => getRentalList(params),
    staleTime: 30 * 1000, // 30초
  });
}

/**
 * 임차 관리 상세 조회 훅
 */
export function useRentalView(id: number) {
  return useQuery({
    queryKey: rentalKeys.detail(id),
    queryFn: () => getRentalView(id),
    enabled: id > 0,
    staleTime: 60 * 1000, // 1분
  });
}

// ============================================================================
// Mutation Hooks
// ============================================================================

/**
 * 임차 관리 등록 훅
 */
export function useAddRental() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: RentalVO) => addRental(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: rentalKeys.lists() });
    },
  });
}

/**
 * 임차 관리 수정 훅
 */
export function useEditRental() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: RentalVO & { id: number }) => editRental(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: rentalKeys.lists() });
      queryClient.invalidateQueries({ queryKey: rentalKeys.details() });
    },
  });
}

/**
 * 임차 관리 삭제 훅
 */
export function useDeleteRental() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteRental(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: rentalKeys.lists() });
      queryClient.invalidateQueries({ queryKey: rentalKeys.details() });
    },
  });
}
