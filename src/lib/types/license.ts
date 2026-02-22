/**
 * 자격증(License) 관련 타입 정의
 *
 * csp-was LicenseController, LicenseDTO 기반
 */

import type { PageResponse } from "./facility";

// ============================================================================
// Enums
// ============================================================================

/**
 * 자격증 상태
 */
export const LicenseState = {
  USE: "USE",
  STOP: "STOP",
} as const;

export type LicenseState = (typeof LicenseState)[keyof typeof LicenseState];

export const LicenseStateLabel: Record<LicenseState, string> = {
  USE: "사용중",
  STOP: "사용중지",
};

export const LicenseStateStyle: Record<LicenseState, string> = {
  USE: "bg-green-100 text-green-700",
  STOP: "bg-gray-100 text-gray-600",
};

// ============================================================================
// DTOs
// ============================================================================

/**
 * 자격증 기본 정보 DTO
 */
export interface LicenseInfoDTO {
  id: number;
  name: string;
  publisher: string;
  state: string;
  licenseDepth1: string;
  licenseDepth1Id: number;
  licenseDepth2: string;
  licenseDepth2Id: number;
  licenseDepth3: string;
  licenseDepth3Id: number;
}

/**
 * 자격증 분류 DTO
 */
export interface LicenseCategoryDTO {
  id: number;
  name: string;
  depth: number;
  parentId: number | null;
  children?: LicenseCategoryDTO[];
}

/**
 * 자격증 파일 DTO
 */
export interface LicenseFileDTO {
  id: number;
  originFileName: string;
  savedFileName: string;
  fileUrl: string;
}

/**
 * 자격증 보유자 DTO
 */
export interface LicenseUserDTO {
  id: number;
  accountId: number;
  accountName: string;
  companyName: string;
  licenseNo: string;
  passDate: string | null;
  publishDate: string | null;
  note: string;
  licenseInfo: LicenseInfoDTO;
  files: LicenseFileDTO[];
}

// ============================================================================
// Search VO
// ============================================================================

/**
 * 자격증 검색 조건
 */
export interface SearchLicenseVO {
  accountId?: number;
  companyId?: number;
  wideAreaId?: number;
  baseAreaId?: number;
  buildingId?: number;
  firstCategoryId?: number;
  secondCategoryId?: number;
  thirdCategoryId?: number;
  page?: number;
  size?: number;
}

// ============================================================================
// API Response
// ============================================================================

export type LicenseListResponse = PageResponse<LicenseInfoDTO>;
export type LicenseUserListResponse = PageResponse<LicenseUserDTO>;
