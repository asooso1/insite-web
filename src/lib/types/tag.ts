/**
 * 태그(NFC/QR) 관련 타입 정의
 *
 * csp-was TagController 기반
 */

import type { PageResponse } from "./facility";

// ============================================================================
// Enums
// ============================================================================

/**
 * 태그 유형
 */
export const TagType = {
  NFC: "NFC",
  QR: "QR",
} as const;

export type TagType = (typeof TagType)[keyof typeof TagType];

export const TagTypeLabel: Record<TagType, string> = {
  NFC: "NFC",
  QR: "QR",
};

// ============================================================================
// DTOs
// ============================================================================

/**
 * 태그 목록 DTO
 */
export interface TagDTO {
  id: number;
  tagType: TagType;
  tagCode: string;
  facilityName: string;
  buildingFloorName: string;
  zoneName: string | null;
  createdAt: string;
}

/**
 * 태그 상세 DTO
 */
export interface TagDetailDTO {
  id: number;
  tagType: TagType;
  tagCode: string;
  facilityId: number;
  facilityName: string;
  buildingId: number;
  buildingName: string;
  buildingFloorId: number;
  buildingFloorName: string;
  zoneId: number | null;
  zoneName: string | null;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// VOs
// ============================================================================

/**
 * 태그 생성/수정 VO
 */
export interface QrNfcVO {
  id?: number;
  tagType: TagType;
  facilityId: number;
  buildingFloorId: number;
  zoneId?: number | null;
  description?: string;
}

/**
 * 태그 검색 조건
 */
export interface SearchQrNfcVO {
  keyword?: string;
  tagType?: TagType;
  page?: number;
  size?: number;
}

// ============================================================================
// API Response
// ============================================================================

export type TagListResponse = PageResponse<TagDTO>;
