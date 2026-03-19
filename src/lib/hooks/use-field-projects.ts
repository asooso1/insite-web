/**
 * 현장프로젝트(Field Project) React Query 훅
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getFieldProjectList,
  getFieldProject,
  createFieldProject,
  updateFieldProject,
  deleteFieldProject,
  getFieldProjectAccounts,
} from "@/lib/api/field-project";
import type {
  SearchFieldProjectVO,
  FieldProjectCreateVO,
} from "@/lib/types/field-project";

// ============================================================================
// Query Keys
// ============================================================================

export const fieldProjectKeys = {
  all: ["fieldProjects"] as const,
  lists: () => [...fieldProjectKeys.all, "list"] as const,
  list: (params: SearchFieldProjectVO & { page: number; size: number }) =>
    [...fieldProjectKeys.lists(), params] as const,
  details: () => [...fieldProjectKeys.all, "detail"] as const,
  detail: (id: number) => [...fieldProjectKeys.details(), id] as const,
  accounts: (id: number) => [...fieldProjectKeys.detail(id), "accounts"] as const,
};

// ============================================================================
// Query Hooks
// ============================================================================

/**
 * 현장프로젝트 목록 조회 훅 (페이지네이션)
 */
export function useFieldProjectList(
  params: SearchFieldProjectVO & { page: number; size: number }
) {
  return useQuery({
    queryKey: fieldProjectKeys.list(params),
    queryFn: () => getFieldProjectList(params),
    enabled: !!params.buildingId,
    staleTime: 30 * 1000,
  });
}

/**
 * 현장프로젝트 상세 조회 훅
 */
export function useFieldProject(id: number) {
  return useQuery({
    queryKey: fieldProjectKeys.detail(id),
    queryFn: () => getFieldProject(id),
    enabled: !!id,
  });
}

/**
 * 현장프로젝트 참여자 목록 조회 훅
 */
export function useFieldProjectAccounts(projectId: number) {
  return useQuery({
    queryKey: fieldProjectKeys.accounts(projectId),
    queryFn: () => getFieldProjectAccounts(projectId),
    enabled: !!projectId,
  });
}

// ============================================================================
// Mutation Hooks
// ============================================================================

/**
 * 현장프로젝트 등록 훅
 */
export function useCreateFieldProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createFieldProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: fieldProjectKeys.lists() });
    },
  });
}

/**
 * 현장프로젝트 수정 훅
 */
export function useUpdateFieldProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: Partial<FieldProjectCreateVO>;
    }) => updateFieldProject(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: fieldProjectKeys.lists() });
      queryClient.invalidateQueries({ queryKey: fieldProjectKeys.detail(id) });
    },
  });
}

/**
 * 현장프로젝트 삭제 훅
 */
export function useDeleteFieldProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteFieldProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: fieldProjectKeys.lists() });
    },
  });
}
