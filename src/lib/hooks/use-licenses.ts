/**
 * 자격증(License) React Query 훅
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getLicenseList,
  getLicenseView,
  getLicenseUserList,
  getLicenseCategoryList,
  addLicense,
  editLicense,
  editLicenseState,
} from "@/lib/api/license";
import type { SearchLicenseVO } from "@/lib/types/license";

// ============================================================================
// Query Keys
// ============================================================================

export const licenseKeys = {
  all: ["licenses"] as const,
  lists: () => [...licenseKeys.all, "list"] as const,
  list: (params: SearchLicenseVO) => [...licenseKeys.lists(), params] as const,
  details: () => [...licenseKeys.all, "detail"] as const,
  detail: (id: number) => [...licenseKeys.details(), id] as const,
  userLists: () => [...licenseKeys.all, "userList"] as const,
  userList: (params: SearchLicenseVO) => [...licenseKeys.userLists(), params] as const,
  categories: () => [...licenseKeys.all, "categories"] as const,
};

// ============================================================================
// Query Hooks
// ============================================================================

/**
 * 자격증 목록 조회 훅
 */
export function useLicenseList(params: SearchLicenseVO) {
  return useQuery({
    queryKey: licenseKeys.list(params),
    queryFn: () => getLicenseList(params),
  });
}

/**
 * 자격증 상세 조회 훅
 */
export function useLicenseView(id: number) {
  return useQuery({
    queryKey: licenseKeys.detail(id),
    queryFn: () => getLicenseView(id),
    enabled: id > 0,
  });
}

/**
 * 자격증 보유자 목록 조회 훅
 */
export function useLicenseUserList(params: SearchLicenseVO) {
  return useQuery({
    queryKey: licenseKeys.userList(params),
    queryFn: () => getLicenseUserList(params),
  });
}

/**
 * 자격증 분류 목록 조회 훅
 */
export function useLicenseCategoryList() {
  return useQuery({
    queryKey: licenseKeys.categories(),
    queryFn: getLicenseCategoryList,
    staleTime: 1000 * 60 * 10, // 10분 캐시
  });
}

// ============================================================================
// Mutation Hooks
// ============================================================================

/**
 * 자격증 등록 훅
 */
export function useAddLicense() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: FormData) => addLicense(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: licenseKeys.lists() });
      queryClient.invalidateQueries({ queryKey: licenseKeys.userLists() });
    },
  });
}

/**
 * 자격증 수정 훅
 */
export function useEditLicense() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: FormData) => editLicense(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: licenseKeys.lists() });
      queryClient.invalidateQueries({ queryKey: licenseKeys.userLists() });
      queryClient.invalidateQueries({ queryKey: licenseKeys.details() });
    },
  });
}

/**
 * 자격증 상태 변경 훅
 */
export function useEditLicenseState() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (licenseId: number) => editLicenseState(licenseId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: licenseKeys.lists() });
      queryClient.invalidateQueries({ queryKey: licenseKeys.details() });
    },
  });
}
