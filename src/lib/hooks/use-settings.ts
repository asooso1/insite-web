/**
 * 설정(Setting) React Query 훅
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getConfigGroupList,
  getConfig,
  editConfig,
  getFacilityCategoryTreeList,
  addFacilityCategory,
  updateFacilityCategory,
  getFacilityMasterList,
  getFacilityMasterView,
  addFacilityMaster,
  editFacilityMaster,
  copyFacilityMaster,
  getCleaningCategoryList,
  addCleaningCategory,
  updateCleaningCategory,
  getCleaningTargetList,
  addCleaningTarget,
  updateCleaningTarget,
  getCleaningUtilList,
  addCleaningUtil,
  updateCleaningUtil,
  getCleaningCoefficientList,
  addCleaningCoefficient,
  updateCleaningCoefficient,
} from "@/lib/api/setting";
import type {
  SearchKeywordVO,
  ConfigVO,
  FacilityCategoryVO,
  SearchFacilityMasterVO,
  FacilityMasterVO,
  CleaningTreeVO,
  CleaningCoefficientVO,
} from "@/lib/types/setting";

// ============================================================================
// Query Keys
// ============================================================================

export const configKeys = {
  all: ["configs"] as const,
  groups: () => [...configKeys.all, "groups"] as const,
  groupList: (params?: SearchKeywordVO) => [...configKeys.groups(), params] as const,
  details: () => [...configKeys.all, "detail"] as const,
  detail: (id: number) => [...configKeys.details(), id] as const,
};

export const facilityCategoryKeys = {
  all: ["facilityCategories"] as const,
  tree: () => [...facilityCategoryKeys.all, "tree"] as const,
};

export const facilityMasterKeys = {
  all: ["facilityMasters"] as const,
  lists: () => [...facilityMasterKeys.all, "list"] as const,
  list: (params: SearchFacilityMasterVO) =>
    [...facilityMasterKeys.lists(), params] as const,
  details: () => [...facilityMasterKeys.all, "detail"] as const,
  detail: (id: number) => [...facilityMasterKeys.details(), id] as const,
};

// ============================================================================
// 기본 코드 Hooks
// ============================================================================

export function useConfigGroupList(params?: SearchKeywordVO) {
  return useQuery({
    queryKey: configKeys.groupList(params),
    queryFn: () => getConfigGroupList(params),
    staleTime: 30 * 1000, // 30초 - 목록 쿼리 표준
  });
}

export function useConfig(id: number) {
  return useQuery({
    queryKey: configKeys.detail(id),
    queryFn: () => getConfig(id),
    enabled: id > 0,
    staleTime: 60 * 1000, // 1분 - 상세 쿼리 표준
  });
}

export function useEditConfig() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ConfigVO) => editConfig(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: configKeys.all });
    },
  });
}

// ============================================================================
// 설비 분류 Hooks
// ============================================================================

export function useFacilityCategoryTree() {
  return useQuery({
    queryKey: facilityCategoryKeys.tree(),
    queryFn: () => getFacilityCategoryTreeList(),
    staleTime: Infinity, // 정적 데이터
  });
}

export function useAddFacilityCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: FacilityCategoryVO) => addFacilityCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: facilityCategoryKeys.all });
    },
  });
}

export function useUpdateFacilityCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: FacilityCategoryVO) => updateFacilityCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: facilityCategoryKeys.all });
    },
  });
}

// ============================================================================
// 표준 설비 Hooks
// ============================================================================

export function useFacilityMasterList(params: SearchFacilityMasterVO) {
  return useQuery({
    queryKey: facilityMasterKeys.list(params),
    queryFn: () => getFacilityMasterList(params),
    staleTime: 30 * 1000, // 30초 - 목록 쿼리 표준
  });
}

export function useFacilityMasterView(id: number) {
  return useQuery({
    queryKey: facilityMasterKeys.detail(id),
    queryFn: () => getFacilityMasterView(id),
    enabled: id > 0,
    staleTime: 60 * 1000, // 1분 - 상세 쿼리 표준
  });
}

export function useAddFacilityMaster() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: FacilityMasterVO) => addFacilityMaster(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: facilityMasterKeys.lists() });
    },
  });
}

export function useEditFacilityMaster() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: FacilityMasterVO) => editFacilityMaster(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: facilityMasterKeys.lists() });
      if (variables.id) {
        queryClient.invalidateQueries({
          queryKey: facilityMasterKeys.detail(variables.id),
        });
      }
    },
  });
}

export function useCopyFacilityMaster() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => copyFacilityMaster(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: facilityMasterKeys.lists() });
    },
  });
}

// ============================================================================
// 미화 분류 Hooks
// ============================================================================

export const cleaningCategoryKeys = {
  all: ["cleaningCategories"] as const,
  tree: () => [...cleaningCategoryKeys.all, "tree"] as const,
  lists: () => [...cleaningCategoryKeys.all, "list"] as const,
  list: (params?: SearchKeywordVO) => [...cleaningCategoryKeys.lists(), params] as const,
};

export function useCleaningCategoryList(params?: SearchKeywordVO) {
  return useQuery({
    queryKey: cleaningCategoryKeys.list(params),
    queryFn: () => getCleaningCategoryList(params),
    staleTime: 30 * 1000, // 30초 - 목록 쿼리 표준
  });
}

export function useAddCleaningCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CleaningTreeVO) => addCleaningCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cleaningCategoryKeys.all });
    },
  });
}

export function useUpdateCleaningCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CleaningTreeVO) => updateCleaningCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cleaningCategoryKeys.all });
    },
  });
}

// ============================================================================
// 미화 대상 Hooks
// ============================================================================

export const cleaningTargetKeys = {
  all: ["cleaningTargets"] as const,
  tree: () => [...cleaningTargetKeys.all, "tree"] as const,
  lists: () => [...cleaningTargetKeys.all, "list"] as const,
  list: (params?: SearchKeywordVO) => [...cleaningTargetKeys.lists(), params] as const,
};

export function useCleaningTargetList(params?: SearchKeywordVO) {
  return useQuery({
    queryKey: cleaningTargetKeys.list(params),
    queryFn: () => getCleaningTargetList(params),
    staleTime: 30 * 1000, // 30초 - 목록 쿼리 표준
  });
}

export function useAddCleaningTarget() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CleaningTreeVO) => addCleaningTarget(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cleaningTargetKeys.all });
    },
  });
}

export function useUpdateCleaningTarget() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CleaningTreeVO) => updateCleaningTarget(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cleaningTargetKeys.all });
    },
  });
}

// ============================================================================
// 미화 도구 Hooks
// ============================================================================

export const cleaningUtilKeys = {
  all: ["cleaningUtils"] as const,
  tree: () => [...cleaningUtilKeys.all, "tree"] as const,
  lists: () => [...cleaningUtilKeys.all, "list"] as const,
  list: (params?: SearchKeywordVO) => [...cleaningUtilKeys.lists(), params] as const,
};

export function useCleaningUtilList(params?: SearchKeywordVO) {
  return useQuery({
    queryKey: cleaningUtilKeys.list(params),
    queryFn: () => getCleaningUtilList(params),
    staleTime: 30 * 1000, // 30초 - 목록 쿼리 표준
  });
}

export function useAddCleaningUtil() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CleaningTreeVO) => addCleaningUtil(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cleaningUtilKeys.all });
    },
  });
}

export function useUpdateCleaningUtil() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CleaningTreeVO) => updateCleaningUtil(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cleaningUtilKeys.all });
    },
  });
}

// ============================================================================
// 미화 계수 Hooks
// ============================================================================

export const cleaningCoefficientKeys = {
  all: ["cleaningCoefficients"] as const,
  lists: () => [...cleaningCoefficientKeys.all, "list"] as const,
  list: (params?: { type?: string }) => [...cleaningCoefficientKeys.lists(), params] as const,
};

export function useCleaningCoefficientList(params?: { type?: string }) {
  return useQuery({
    queryKey: cleaningCoefficientKeys.list(params),
    queryFn: () => getCleaningCoefficientList(params),
    staleTime: 30 * 1000, // 30초 - 목록 쿼리 표준
  });
}

export function useAddCleaningCoefficient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CleaningCoefficientVO) => addCleaningCoefficient(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cleaningCoefficientKeys.all });
    },
  });
}

export function useUpdateCleaningCoefficient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CleaningCoefficientVO) => updateCleaningCoefficient(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cleaningCoefficientKeys.all });
    },
  });
}
