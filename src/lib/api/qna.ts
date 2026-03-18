/**
 * Q&A API 클라이언트
 *
 * csp-was QnaController 연동
 * - 질문 CRUD 조작
 * - 질문 상태 관리
 */

import { apiClient } from "./client";
import type {
  QnaListResponse,
  QnaDTO,
  SearchQnaVO,
  QnaQuestionVO,
} from "@/lib/types/qna";

// ============================================================================
// Q&A 조회
// ============================================================================

/**
 * Q&A 질문 목록 조회
 */
export async function getQuestionList(
  params: SearchQnaVO
): Promise<QnaListResponse> {
  const searchParams = new URLSearchParams();

  if (params.keyword) searchParams.set("keyword", params.keyword);
  if (params.state) searchParams.set("qnaState", params.state);
  if (params.page !== undefined) searchParams.set("page", String(params.page));
  if (params.size !== undefined) searchParams.set("size", String(params.size));

  return apiClient.get<QnaListResponse>(
    `/api/qna/questionList?${searchParams.toString()}`
  );
}

/**
 * Q&A 질문 상세 조회
 */
export async function getQuestion(id: number): Promise<QnaDTO> {
  return apiClient.get<QnaDTO>(`/api/qna/${id}`);
}

// ============================================================================
// Q&A CRUD
// ============================================================================

/**
 * Q&A 질문 등록
 */
export async function addQuestion(data: FormData): Promise<QnaDTO> {
  return apiClient.postForm<QnaDTO>("/api/qna/addQuestion", data);
}

/**
 * Q&A 질문 수정
 */
export async function editQuestion(data: FormData): Promise<QnaDTO> {
  return apiClient.putForm<QnaDTO>("/api/qna/editQuestion", data);
}

/**
 * Q&A 질문 삭제
 */
export async function deleteQuestion(id: number): Promise<void> {
  return apiClient.delete<void>(`/api/qna/deleteQuestion/${id}`);
}
