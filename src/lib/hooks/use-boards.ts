/**
 * 게시판(Board) React Query 훅
 *
 * - 공지사항(Notice) CRUD + 댓글
 * - 자료실(ReferenceData) CRUD
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getNoticeList,
  getNoticeView,
  addNotice,
  editNotice,
  deleteNotice,
  addComment,
  editComment,
  deleteComment,
  getReferenceDataList,
  getReferenceDataView,
  addReferenceData,
  editReferenceData,
  deleteReferenceData,
} from "@/lib/api/board";
import type {
  SearchNoticeVO,
  NoticeVO,
  NoticeCommentVO,
  SearchReferenceDataVO,
  ReferenceDataVO,
} from "@/lib/types/board";

// ============================================================================
// Query Keys
// ============================================================================

export const noticeKeys = {
  all: ["notices"] as const,
  lists: () => [...noticeKeys.all, "list"] as const,
  list: (params: SearchNoticeVO) => [...noticeKeys.lists(), params] as const,
  details: () => [...noticeKeys.all, "detail"] as const,
  detail: (id: number) => [...noticeKeys.details(), id] as const,
};

export const referenceDataKeys = {
  all: ["referenceData"] as const,
  lists: () => [...referenceDataKeys.all, "list"] as const,
  list: (params: SearchReferenceDataVO) =>
    [...referenceDataKeys.lists(), params] as const,
  details: () => [...referenceDataKeys.all, "detail"] as const,
  detail: (id: number) => [...referenceDataKeys.details(), id] as const,
};

// ============================================================================
// 공지사항 Query Hooks
// ============================================================================

/**
 * 공지사항 목록 조회
 */
export function useNoticeList(params: SearchNoticeVO) {
  return useQuery({
    queryKey: noticeKeys.list(params),
    queryFn: () => getNoticeList(params),
  });
}

/**
 * 공지사항 상세 조회
 */
export function useNoticeView(id: number) {
  return useQuery({
    queryKey: noticeKeys.detail(id),
    queryFn: () => getNoticeView(id),
    enabled: id > 0,
  });
}

// ============================================================================
// 공지사항 Mutation Hooks
// ============================================================================

/**
 * 공지사항 등록
 */
export function useAddNotice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: NoticeVO) => addNotice(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: noticeKeys.lists() });
    },
  });
}

/**
 * 공지사항 수정
 */
export function useEditNotice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: NoticeVO) => editNotice(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: noticeKeys.lists() });
      if (variables.id) {
        queryClient.invalidateQueries({
          queryKey: noticeKeys.detail(variables.id),
        });
      }
    },
  });
}

/**
 * 공지사항 삭제
 */
export function useDeleteNotice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteNotice(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: noticeKeys.lists() });
    },
  });
}

// ============================================================================
// 댓글 Mutation Hooks
// ============================================================================

/**
 * 댓글 등록
 */
export function useAddComment(noticeId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: NoticeCommentVO) => addComment(noticeId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: noticeKeys.detail(noticeId),
      });
    },
  });
}

/**
 * 댓글 수정
 */
export function useEditComment(noticeId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ commentId, data }: { commentId: number; data: NoticeCommentVO }) =>
      editComment(commentId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: noticeKeys.detail(noticeId),
      });
    },
  });
}

/**
 * 댓글 삭제
 */
export function useDeleteComment(noticeId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentId: number) => deleteComment(commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: noticeKeys.detail(noticeId),
      });
    },
  });
}

// ============================================================================
// 자료실 Query Hooks
// ============================================================================

/**
 * 자료실 목록 조회
 */
export function useReferenceDataList(params: SearchReferenceDataVO) {
  return useQuery({
    queryKey: referenceDataKeys.list(params),
    queryFn: () => getReferenceDataList(params),
  });
}

/**
 * 자료실 상세 조회
 */
export function useReferenceDataView(id: number) {
  return useQuery({
    queryKey: referenceDataKeys.detail(id),
    queryFn: () => getReferenceDataView(id),
    enabled: id > 0,
  });
}

// ============================================================================
// 자료실 Mutation Hooks
// ============================================================================

/**
 * 자료실 등록
 */
export function useAddReferenceData() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ReferenceDataVO) => addReferenceData(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: referenceDataKeys.lists() });
    },
  });
}

/**
 * 자료실 수정
 */
export function useEditReferenceData() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ReferenceDataVO) => editReferenceData(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: referenceDataKeys.lists() });
      if (variables.id) {
        queryClient.invalidateQueries({
          queryKey: referenceDataKeys.detail(variables.id),
        });
      }
    },
  });
}

/**
 * 자료실 삭제
 */
export function useDeleteReferenceData() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteReferenceData(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: referenceDataKeys.lists() });
    },
  });
}
