/**
 * FAQ React Query 훅
 *
 * - FAQ CRUD 조작
 * - 메뉴(카테고리) 조회
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getFaqList,
  getFaq,
  getFaqMenus,
  addFaq,
  editFaq,
  deleteFaq,
} from "@/lib/api/faq";
import type { SearchFaqVO } from "@/lib/types/faq";

// ============================================================================
// Query Keys
// ============================================================================

export const faqKeys = {
  all: ["faqs"] as const,
  lists: () => [...faqKeys.all, "list"] as const,
  list: (params: SearchFaqVO) => [...faqKeys.lists(), params] as const,
  details: () => [...faqKeys.all, "detail"] as const,
  detail: (id: number) => [...faqKeys.details(), id] as const,
  menus: () => [...faqKeys.all, "menus"] as const,
};

// ============================================================================
// FAQ Query Hooks
// ============================================================================

/**
 * FAQ 목록 조회
 */
export function useFaqList(params: SearchFaqVO) {
  return useQuery({
    queryKey: faqKeys.list(params),
    queryFn: () => getFaqList(params),
    staleTime: 30 * 1000,
  });
}

/**
 * FAQ 상세 조회
 */
export function useFaq(id: number) {
  return useQuery({
    queryKey: faqKeys.detail(id),
    queryFn: () => getFaq(id),
    enabled: id > 0,
    staleTime: 60 * 1000,
  });
}

/**
 * FAQ 메뉴(카테고리) 목록 조회
 */
export function useFaqMenus() {
  return useQuery({
    queryKey: faqKeys.menus(),
    queryFn: () => getFaqMenus(),
    staleTime: Infinity,
  });
}

// ============================================================================
// FAQ Mutation Hooks
// ============================================================================

/**
 * FAQ 등록
 */
export function useAddFaq() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: FormData) => addFaq(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: faqKeys.lists() });
    },
  });
}

/**
 * FAQ 수정
 */
export function useEditFaq() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: FormData) => editFaq(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: faqKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: faqKeys.detail(response.id),
      });
    },
  });
}

/**
 * FAQ 삭제
 */
export function useDeleteFaq() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteFaq(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: faqKeys.lists() });
    },
  });
}
