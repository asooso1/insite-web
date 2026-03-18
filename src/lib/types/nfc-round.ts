/**
 * NFC 라운드(NFC Round) 관련 타입 정의
 *
 * csp-was NfcRoundController 기반
 */

import type { PageResponse } from "./facility";

// ============================================================================
// Enums
// ============================================================================

/**
 * NFC 라운드 상태
 */
export const NfcRoundState = {
  PENDING: "PENDING",
  IN_PROGRESS: "IN_PROGRESS",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
} as const;

export type NfcRoundState = (typeof NfcRoundState)[keyof typeof NfcRoundState];

export const NfcRoundStateLabel: Record<NfcRoundState, string> = {
  PENDING: "대기",
  IN_PROGRESS: "진행중",
  COMPLETED: "완료",
  CANCELLED: "취소",
};

/**
 * NFC 라운드 이슈 상태
 */
export const NfcRoundIssueState = {
  PASS: "PASS",
  FAIL: "FAIL",
  PENDING: "PENDING",
} as const;

export type NfcRoundIssueState =
  (typeof NfcRoundIssueState)[keyof typeof NfcRoundIssueState];

export const NfcRoundIssueStateLabel: Record<NfcRoundIssueState, string> = {
  PASS: "통과",
  FAIL: "불통",
  PENDING: "대기",
};

// ============================================================================
// DTOs
// ============================================================================

/**
 * NFC 라운드 양식 DTO
 */
export interface NfcRoundFormDTO {
  id: number;
  name: string;
  facilityName: string;
  state: string;
  checkDate: string;
  totalCount: number;
  passCount: number;
  failCount: number;
  createdAt: string;
}

/**
 * NFC 라운드 이슈 DTO
 */
export interface NfcRoundIssueDTO {
  id: number;
  nfcRoundId: number;
  categoryName: string;
  itemName: string;
  state: NfcRoundIssueState;
  comment: string | null;
  checkDate: string;
}

/**
 * NFC 라운드 상세 DTO
 */
export interface NfcRoundDetailDTO {
  id: number;
  name: string;
  facilityName: string;
  facilityId: number;
  buildingName: string;
  state: NfcRoundState;
  checkDate: string;
  totalCount: number;
  passCount: number;
  failCount: number;
  createdAt: string;
  description: string | null;
}

/**
 * NFC 라운드 카테고리 DTO
 */
export interface NfcRoundCategoryDTO {
  id: number;
  name: string;
  itemCount: number;
}

/**
 * NFC 라운드 카테고리 항목 DTO
 */
export interface NfcRoundCategoryItemDTO {
  id: number;
  categoryId: number;
  name: string;
  description: string | null;
}

// ============================================================================
// VOs
// ============================================================================

/**
 * NFC 라운드 등록/수정 VO
 */
export interface NfcRoundVO {
  id?: number;
  nfcRoundData: {
    name: string;
    facilityId: number;
    checkDate: string;
    description?: string;
  };
}

/**
 * NFC 라운드 검색 조건
 */
export interface SearchNfcRoundVO {
  keyword?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  size?: number;
}

// ============================================================================
// API Response
// ============================================================================

export type NfcRoundFormListResponse = PageResponse<NfcRoundFormDTO>;
export type NfcRoundIssueListResponse = PageResponse<NfcRoundIssueDTO>;
