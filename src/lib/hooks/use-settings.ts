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
} from "@/lib/api/setting";
import type {
  SearchKeywordVO,
  ConfigVO,
  FacilityCategoryVO,
  SearchFacilityMasterVO,
  FacilityMasterVO,
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
  });
}

export function useConfig(id: number) {
  return useQuery({
    queryKey: configKeys.detail(id),
    queryFn: () => getConfig(id),
    enabled: id > 0,
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
  });
}

export function useFacilityMasterView(id: number) {
  return useQuery({
    queryKey: facilityMasterKeys.detail(id),
    queryFn: () => getFacilityMasterView(id),
    enabled: id > 0,
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
