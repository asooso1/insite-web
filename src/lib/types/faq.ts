/**
 * FAQ(자주묻는질문) 관련 타입 정의
 *
 * csp-was FaqController 기반
 * - FAQ 목록/상세/등록/수정/삭제
 * - 메뉴(카테고리) 조회
 */

import type { PageResponse } from "./facility";

// ============================================================================
// DTOs
// ============================================================================

/**
 * FAQ 카테고리(메뉴) DTO
 */
export interface FaqMenuDTO {
  id: number;
  menuName: string;
}

/**
 * FAQ DTO (상세)
 */
export interface FaqDTO {
  id: number;
  title: string;
  content: string;
  menuId: number;
  menuName: string;
  viewCount: number;
  createdAt: string;
  createdBy: string;
  updatedAt?: string;
  updatedBy?: string;
}

// ============================================================================
// Search VOs
// ============================================================================

/**
 * FAQ 검색 조건
 */
export interface SearchFaqVO {
  keyword?: string;
  menuId?: number;
  page?: number;
  size?: number;
}

// ============================================================================
// Create/Update VOs
// ============================================================================

/**
 * FAQ 등록/수정 VO
 */
export interface FaqVO {
  id?: number;
  title: string;
  content: string;
  menuId: number;
}

// ============================================================================
// API Responses
// ============================================================================

export type FaqListResponse = PageResponse<FaqDTO>;
