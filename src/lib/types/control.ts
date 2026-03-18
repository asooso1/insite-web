/**
 * 제어(Control) 관련 타입 정의
 *
 * csp-was ControlController 기반
 */

import type { PageResponse } from "./facility";

// ============================================================================
// Enums
// ============================================================================

/**
 * 제어 상태
 */
export const ControlState = {
  WRITE: "WRITE",
  REQUEST: "REQUEST",
  COMPLETE: "COMPLETE",
  CANCEL: "CANCEL",
} as const;

export type ControlState = (typeof ControlState)[keyof typeof ControlState];

/**
 * 제어 상태 한글 라벨
 */
export const ControlStateLabel: Record<ControlState, string> = {
  WRITE: "작성",
  REQUEST: "요청",
  COMPLETE: "완료",
  CANCEL: "취소",
};

/**
 * 제어 상태 스타일 (StatusBadge용)
 */
export const ControlStateStyle: Record<
  ControlState,
  "pending" | "inProgress" | "completed" | "cancelled"
> = {
  WRITE: "pending",
  REQUEST: "inProgress",
  COMPLETE: "completed",
  CANCEL: "cancelled",
};

// ============================================================================
// DTOs
// ============================================================================

/**
 * 제어 DTO
 */
export interface ControlDTO {
  id: number;
  name: string;
  state: ControlState;
  targetValue: string;
  currentValue: string;
  facilityName: string;
  facilityId: number;
  buildingName: string;
  buildingId: number;
  description: string;
  createdAt: string;
}

/**
 * 제어 목록 DTO
 */
export interface ControlListDTO extends ControlDTO {}

// ============================================================================
// Search/Filter VO
// ============================================================================

/**
 * 제어 검색 조건
 */
export interface SearchControlVO {
  keyword?: string;
  state?: ControlState;
  page?: number;
  size?: number;
}

// ============================================================================
// Create/Update VO
// ============================================================================

/**
 * 제어 등록/수정 VO
 */
export interface ControlVO {
  id?: number;
  name: string;
  targetValue: string;
  facilityId: number;
  description?: string;
}

/**
 * 제어 요청 VO
 */
export interface ControlRequestVO {
  id: number;
}

// ============================================================================
// API Response
// ============================================================================

/**
 * 제어 목록 응답
 */
export type ControlListResponse = PageResponse<ControlListDTO>;
