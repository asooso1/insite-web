/**
 * Q&A(질문답변) 관련 타입 정의
 *
 * csp-was QnaController 기반
 * - 질문 목록/상세/등록/수정/삭제
 * - 질문 상태 관리 (대기/완료)
 */

import type { PageResponse } from "./facility";

// ============================================================================
// Enums
// ============================================================================

/**
 * Q&A 질문 상태
 */
export const QnaState = {
  WAIT: "WAIT",
  COMPLETE: "COMPLETE",
} as const;

export type QnaState = (typeof QnaState)[keyof typeof QnaState];

export const QnaStateLabel: Record<QnaState, string> = {
  WAIT: "답변 대기",
  COMPLETE: "답변 완료",
};

export const QnaStateStyle: Record<QnaState, "pending" | "completed"> = {
  WAIT: "pending",
  COMPLETE: "completed",
};

// ============================================================================
// DTOs
// ============================================================================

/**
 * Q&A DTO (상세)
 */
export interface QnaDTO {
  id: number;
  title: string;
  content: string;
  state: QnaState;
  answer?: string;
  answeredAt?: string;
  authorName: string;
  createdAt: string;
  updatedAt?: string;
}

// ============================================================================
// Search VOs
// ============================================================================

/**
 * Q&A 검색 조건
 */
export interface SearchQnaVO {
  keyword?: string;
  state?: QnaState;
  page?: number;
  size?: number;
}

// ============================================================================
// Create/Update VOs
// ============================================================================

/**
 * Q&A 질문 등록/수정 VO
 */
export interface QnaQuestionVO {
  id?: number;
  title: string;
  content: string;
}

// ============================================================================
// API Responses
// ============================================================================

export type QnaListResponse = PageResponse<QnaDTO>;
