/**
 * Q&A React Query 훅
 *
 * - 질문 CRUD 조작
 * - 질문 상태 관리
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getQuestionList,
  getQuestion,
  addQuestion,
  editQuestion,
  deleteQuestion,
} from "@/lib/api/qna";
import type { SearchQnaVO } from "@/lib/types/qna";

// ============================================================================
// Query Keys
// ============================================================================

export const qnaKeys = {
  all: ["qna"] as const,
  lists: () => [...qnaKeys.all, "list"] as const,
  list: (params: SearchQnaVO) => [...qnaKeys.lists(), params] as const,
  details: () => [...qnaKeys.all, "detail"] as const,
  detail: (id: number) => [...qnaKeys.details(), id] as const,
};

// ============================================================================
// Q&A Query Hooks
// ============================================================================

/**
 * Q&A 질문 목록 조회
 */
export function useQuestionList(params: SearchQnaVO) {
  return useQuery({
    queryKey: qnaKeys.list(params),
    queryFn: () => getQuestionList(params),
    staleTime: 30 * 1000,
  });
}

/**
 * Q&A 질문 상세 조회
 */
export function useQuestion(id: number) {
  return useQuery({
    queryKey: qnaKeys.detail(id),
    queryFn: () => getQuestion(id),
    enabled: id > 0,
    staleTime: 60 * 1000,
  });
}

// ============================================================================
// Q&A Mutation Hooks
// ============================================================================

/**
 * Q&A 질문 등록
 */
export function useAddQuestion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: FormData) => addQuestion(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: qnaKeys.lists() });
    },
  });
}

/**
 * Q&A 질문 수정
 */
export function useEditQuestion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: FormData) => editQuestion(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: qnaKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: qnaKeys.detail(response.id),
      });
    },
  });
}

/**
 * Q&A 질문 삭제
 */
export function useDeleteQuestion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteQuestion(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: qnaKeys.lists() });
    },
  });
}
