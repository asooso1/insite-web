/**
 * 개인정보정책 React Query 훅
 *
 * - 정책 조회/수정/삭제
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getPrivacyPolicy,
  editPrivacyPolicy,
  deletePrivacyPolicy,
} from "@/lib/api/privacy";
import type { PrivacyVO } from "@/lib/types/privacy";

// ============================================================================
// Query Keys
// ============================================================================

export const privacyKeys = {
  all: ["privacy"] as const,
  policies: () => [...privacyKeys.all, "policy"] as const,
  policy: () => [...privacyKeys.policies()] as const,
};

// ============================================================================
// Privacy Query Hooks
// ============================================================================

/**
 * 개인정보정책 조회
 */
export function usePrivacyPolicy() {
  return useQuery({
    queryKey: privacyKeys.policy(),
    queryFn: () => getPrivacyPolicy(),
    staleTime: 60 * 1000,
  });
}

// ============================================================================
// Privacy Mutation Hooks
// ============================================================================

/**
 * 개인정보정책 수정
 */
export function useEditPrivacyPolicy() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: PrivacyVO) => editPrivacyPolicy(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: privacyKeys.policy() });
    },
  });
}

/**
 * 개인정보정책 삭제
 */
export function useDeletePrivacyPolicy() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deletePrivacyPolicy(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: privacyKeys.policy() });
    },
  });
}
