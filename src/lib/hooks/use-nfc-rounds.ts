/**
 * NFC 라운드(NFC Round) React Query 훅
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getNfcRoundForms,
  getNfcRoundIssues,
  getNfcRoundDetail,
  updateNfcRound,
  getNfcRoundCategories,
  getNfcRoundCategoryItems,
  createWorkOrderFromNfcRound,
} from "@/lib/api/nfc-round";
import type {
  SearchNfcRoundVO,
  NfcRoundVO,
} from "@/lib/types/nfc-round";

// ============================================================================
// Query Keys
// ============================================================================

export const nfcRoundKeys = {
  all: ["nfcRounds"] as const,
  lists: () => [...nfcRoundKeys.all, "list"] as const,
  forms: () => [...nfcRoundKeys.lists(), "forms"] as const,
  formList: (params: SearchNfcRoundVO) => [
    ...nfcRoundKeys.forms(),
    params,
  ] as const,
  issues: () => [...nfcRoundKeys.lists(), "issues"] as const,
  issueList: (params: SearchNfcRoundVO) => [
    ...nfcRoundKeys.issues(),
    params,
  ] as const,
  details: () => [...nfcRoundKeys.all, "detail"] as const,
  detail: (id: number) => [...nfcRoundKeys.details(), id] as const,
  categories: ["nfcRoundCategories"] as const,
  categoryItems: ["nfcRoundCategoryItems"] as const,
};

// ============================================================================
// Query Hooks
// ============================================================================

/**
 * NFC 라운드 양식 목록 조회 훅
 */
export function useNfcRoundForms(params: SearchNfcRoundVO) {
  return useQuery({
    queryKey: nfcRoundKeys.formList(params),
    queryFn: () => getNfcRoundForms(params),
    staleTime: 30 * 1000,
  });
}

/**
 * NFC 라운드 이슈 목록 조회 훅
 */
export function useNfcRoundIssues(params: SearchNfcRoundVO) {
  return useQuery({
    queryKey: nfcRoundKeys.issueList(params),
    queryFn: () => getNfcRoundIssues(params),
    staleTime: 30 * 1000,
  });
}

/**
 * NFC 라운드 상세 조회 훅
 */
export function useNfcRoundDetail(id: number) {
  return useQuery({
    queryKey: nfcRoundKeys.detail(id),
    queryFn: () => getNfcRoundDetail(id),
    enabled: id > 0,
    staleTime: 60 * 1000,
  });
}

/**
 * NFC 라운드 카테고리 목록 조회 훅
 */
export function useNfcRoundCategories() {
  return useQuery({
    queryKey: nfcRoundKeys.categories,
    queryFn: () => getNfcRoundCategories(),
    staleTime: Infinity,
  });
}

/**
 * NFC 라운드 카테고리 항목 목록 조회 훅
 */
export function useNfcRoundCategoryItems() {
  return useQuery({
    queryKey: nfcRoundKeys.categoryItems,
    queryFn: () => getNfcRoundCategoryItems(),
    staleTime: Infinity,
  });
}

// ============================================================================
// Mutation Hooks
// ============================================================================

/**
 * NFC 라운드 수정 훅
 */
export function useUpdateNfcRound() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: NfcRoundVO) => updateNfcRound(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: nfcRoundKeys.forms() });
      if (variables.id) {
        queryClient.invalidateQueries({
          queryKey: nfcRoundKeys.detail(variables.id),
        });
      }
    },
  });
}

/**
 * NFC 라운드 작업지시 생성 훅
 */
export function useCreateWorkOrderFromNfcRound() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (nfcRoundId: number) => createWorkOrderFromNfcRound(nfcRoundId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: nfcRoundKeys.lists() });
    },
  });
}
