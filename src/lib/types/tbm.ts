/**
 * TBM(작업전미팅) 관련 타입 정의
 *
 * csp-was TbmService, TbmVO 기반
 */

import type { PageResponse } from "./work-order";

// ============================================================================
// Enums
// ============================================================================

/**
 * TBM 유형
 */
export const TbmType = {
  REGULAR: "REGULAR",
  SPECIAL: "SPECIAL",
} as const;

export type TbmType = (typeof TbmType)[keyof typeof TbmType];

/**
 * TBM 유형 한글 라벨
 */
export const TbmTypeLabel: Record<TbmType, string> = {
  REGULAR: "정기",
  SPECIAL: "수시",
};

/**
 * TBM 상태
 */
export const TbmState = {
  PLAN: "PLAN",
  PROGRESS: "PROGRESS",
  COMPLETE: "COMPLETE",
  HOLD: "HOLD",
} as const;

export type TbmState = (typeof TbmState)[keyof typeof TbmState];

/**
 * TBM 상태 한글 라벨
 */
export const TbmStateLabel: Record<TbmState, string> = {
  PLAN: "계획",
  PROGRESS: "진행",
  COMPLETE: "완료",
  HOLD: "보류",
};

/**
 * TBM 상태 스타일 (StatusBadge용)
 */
export const TbmStateStyle: Record<
  TbmState,
  "pending" | "inProgress" | "completed" | "cancelled"
> = {
  PLAN: "pending",
  PROGRESS: "inProgress",
  COMPLETE: "completed",
  HOLD: "cancelled",
};

// ============================================================================
// DTOs
// ============================================================================

/**
 * 사용자 그룹 DTO
 */
export interface UserGroupDTO {
  id: number;
  name: string;
}

/**
 * 빌딩 DTO (간략)
 */
export interface TbmBuildingDTO {
  id: number;
  name: string;
}

/**
 * TBM DTO (목록)
 */
export interface TbmDTO {
  id: number;
  buildingId: number;
  buildingUserGroupId: number;
  name: string;
  tbmType: TbmType;
  tbmState: TbmState;
  cycle?: number;
  lastModifierName?: string;
  lastModifyDate?: string;
  lastExecuteTime?: string;
  nextExecuteTime?: string;
  buildingDTO?: TbmBuildingDTO;
  userGroupDTO?: UserGroupDTO;
}

/**
 * TBM 목록 응답
 */
export type TbmListResponse = PageResponse<TbmDTO>;

// ============================================================================
// Search/Filter VO
// ============================================================================

/**
 * TBM 검색 조건
 */
export interface SearchTbmVO {
  buildingId?: number;
  tbmType?: TbmType;
  tbmState?: TbmState;
  buildingUserGroupId?: number;
  searchCode?: string;
  searchKeyword?: string;
  page?: number;
  size?: number;
}

// ============================================================================
// Create/Update VO
// ============================================================================

/**
 * TBM 등록/수정 VO
 */
export interface TbmVO {
  buildingId: number;
  buildingUserGroupId: number;
  name: string;
  tbmType: TbmType;
  tbmState: TbmState;
  cycle?: number;
}
